<template>
  <div>
    <!-- <el-header>
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="8" class="title-left">
                    <i class="el-icon-menu"></i>
                    <span>CATEGORIES</span>
                </el-col>
                <el-col :span="6">
                    <el-input class="search1 search2 search3" placeholder="搜索书籍" active-text-color="#4F6E9D" prefix-icon="el-icon-search" v-model="searchText" @confirm="toSearch()"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button class="cateButton" icon="el-icon-search" @click="toSearch()"></el-button>
                </el-col>
                <el-col :span="8" class="title-right">
                    <el-tag type="warning" size="medium">Books</el-tag>
                </el-col>
            </el-row>
        </el-header> -->

    <el-container>
      <el-aside width="250px">
        <el-card class="leftNav">
          <img src="../../../static/cateNav.png" class="leftImg" />
          <div class="nav__wrapper">
            <div
              class="navItem"
              v-for="(item, index) in navItems"
              :class="{'cur' : index === showCategoryIndex}"
              :key="item.id"
              @click="showCategory(item.id, index)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="navItem" @click="toTop()">
            <i class="el-icon-arrow-up" style="font-size: 23px"></i>
          </div>
        </el-card>
      </el-aside>

      <el-main
        v-loading.fullscreen.lock="loading"
        element-loading-background="#FFFFFF"
      >
        <el-row>
          <el-card
            class="row"
            v-for="(book, index) in Books"
            :key="index"
            :body-style="{ padding: '0px' }"
          >
            <img
              class="img"
              @click="toInfo(book)"
              :src="
                'http://121.4.124.243/uploads/' + book.avatar
              "
            />
            <el-link class="name" @click="toInfo(book)" :underline="false">
              {{ book.name }}
            </el-link>
            <div class="author">{{ book.master }}</div>

            <div style="position: absolute; bottom: 0;  margin-left: 200px;">
              <el-row type="flex" align="middle">
                <el-col :span="12">
                  <button class="shop" @click="addToCart(book)">
                    <i class="el-icon-goods icon"></i>
                  </button>
                </el-col>
                <el-col :span="12" class="price">¥ {{ book.price }}</el-col>
              </el-row>
              <el-rate
                class="rate"
                v-model="book.Commend"
                :colors="colors"
                disabled
              ></el-rate>
            </div>
          </el-card>
        </el-row>

        <el-row class="page">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            :total="total"
          >
          </el-pagination>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { request } from '../../api/http'
import { AllType, AllAlbum, AddCart } from '../../api/url'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  data () {
    return {
      loading: true,
      scroll: 0, // 第一步：定义初始滚动高度
      activeIndex: '1',
      bookPath: 1,
      searchText: '', // 搜索关键字
      showCategoryIndex: 0,
      navItems: [],
      Books: [],
      currentPage: 1,
      pagesize: 20,
      total: 0
    }
  },
  // 第二步：mounted中的方法代表dom已经加载完毕
  mounted: function () {
    window.addEventListener('scroll', this.handleScroll)
  },
  async created () {
    await this.getMusicCategory()
    const id = this.navItems[0] && this.navItems[0].id
    await this.getAllAlbum(id)
  },
  methods: {
    // 获取分类
    getMusicCategory () {
      return request({
        url: AllType,
        pack: ''
      })
        .then(res => {
          console.log(res, 333)
          if (res.code === 200) {
            this.navItems = res.data
          }
        })
    },
    // 获取不同分类专辑信息
    getAllAlbum (type) {
      // const type = this.navItems[0].hasOwnProperty('id') ? this.navItems[0].id : ''
      const params = {
        pageSize: 10,
        pageNum: 1,
        type
      }
      return request({
        url: AllAlbum,
        params,
        pack: ''
      })
        .then(res => {
          console.log(res, 444)
          this.loading = false
          if (res.code === 200) {
            this.Books = res.data.list
            this.total = res.data.totalSize
          }
        })
        .catch(err => {
          console.log(err, 444)
        })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    // 第三步：用于存放页面函数
    handleScroll () {
      this.scroll = $(window).height() + $(document).scrollTop()
    },
    toTop () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    toInfo (e) {
      this.$router.push({
        path: '/bookInfo',
        query: {
          ID: e.id
        }
      })
    },
    showCategory (id, index) {
      this.showCategoryIndex = index
      this.getAllAlbum(id)
    },
    addToCart (e) {
      this.$confirm('确定将此书加入购物车?', 'smallFrog', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(this.$cookies.get('token'), 55);
          request({
            url: AddCart,
            pack: '',
            params: {
              aid: e.id,
              count: 1
            },
            headersParams: {
              'token': this.$cookies.get('token')
            }
          })
            .then((res) => {
              console.log('success', res)
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '成功加入购物车！'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
        })
        .catch(() => {})
    }
  },
  // 第四步：当再次进入（前进或者后退）时，只触发activated（注：只有在keep-alive加载时调用）
  activated () {
    if (this.scroll > 0) {
      window.scrollTo(0, this.scroll)
      window.addEventListener('scroll', this.handleScroll)
    }
  },
  // 第五步：deactivated 页面退出时关闭事件 防止其他页面出现问题
  deactivated () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.title-left {
  line-height: 100px;
  margin-left: 20px;
  font-size: 25px;
  color: #4f6e9d;
}

.title-right {
  line-height: 100px;
  text-align: end;
  margin-right: 20px;
  color: #4f6e9d;
}

.cateButton {
  border-radius: 25px;
  background-color: #4f6e9d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  color: #ffffff;
  margin-left: 20px;
}
.nav__wrapper {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 250px;
  padding-right: 5px;
}
.nav__wrapper::-webkit-scrollbar {
  width: 2px;
}
.nav__wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #EDEDED;
}
.nav__wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #4f6e9d;
}
/* main里的样式 */
.leftNav {
  top: 50%;
  width: 150px;
  height: 410px;
  margin-top: -180px;
  margin-left: 60px;
  position: fixed;
  border-radius: 20px;
  background-color: #4f6e9d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  z-index: 1;
}

.leftNav .leftImg {
  width: 100%;
  margin-bottom: 20px;
  color: #ffffff;
  position: relative;
  border-radius: 12px;
}

.leftNav .navItem {
  text-align: center;
  height: 60px;
  cursor: pointer;
  color: #ffffff;
  cursor: pointer;
  position: relative;
}

.leftNav .navItem:hover {
  transform: scale(1.05);
}

.leftNav .navItem.cur::after {
  color: #ffffff;
  content: "";
  width: 5px;
  height: 22px;
  border-radius: 10px 10px 10px 10px;
  position: absolute;
  background-color: currentColor;
  top: 0;
  right: 0;
  margin: auto;
}

.row {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 400px;
  height: 160px;
  margin-left: 30px;
  margin-right: 30px;
  display: inline-block;
  position: relative;
}

.row .img {
  height: 140px;
  width: 180px;
  text-align: center;
  /* display: block; */
  cursor: pointer;
  transition: all 0.6s;
  top: 0;
  left: -190px;
  right: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
}

.row .img:hover {
  transform: scale(1.1);
}

.row .name {
  padding-top: 14px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 16px;
  margin-left: 200px;
}

.el-link.el-link--default {
  color: #4f6e9d;
}

.el-link.el-link--default:hover {
  color: #7e9dca;
}

.row .readIcon {
  text-align: left;
  padding-right: 5px;
}

.row .author {
  text-align: left;
  color: #909399;
  padding-top: 14px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 15px;
  margin-left: 200px;
}

.row .price {
  margin-top: 6px;
  margin-bottom: 10px;
  font-size: 15px;
  /* padding-left: 35px; */
  margin-left: -25px;
  padding-top: 4px;
}

.row .shop {
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  outline: none;
  background-color: #ffffff;
  font-size: 20px;
  float: right;
  padding-right: 35px;
}

.row .shop .icon {
  color: #d84237;
  cursor: pointer;
  transition: all 0.3s;
}

.row .shop .icon:hover {
  transform: scale(1.1);
}

.row .rate {
  text-align: center;
  padding: 0 10px 14px 10px;
}

.page {
  margin-top: 30px;
  text-align: center;
}
</style>
