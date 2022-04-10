<template>
  <div>
    <div class="pageHeader">
      <el-page-header @back="goBack" content="专辑详情"></el-page-header>
    </div>
    <div v-loading="loading" class="bookInfo">
      <el-card class="box-card leftInfo">
        <img
          class="img"
          :src="
            'http://121.4.124.243/uploads/' +
            this.bookInfo.avatar
          "
        />
        <div style="display: flex; margin-top: 20px; align-items: center">
          <div style="color: #606266">推荐程度：</div>
          <el-rate
            style="margin-top: 4px"
            v-model="rate"
            :colors="colors"
            disabled
          ></el-rate>
        </div>
      </el-card>
      <div class="rightInfo" style="position: relative">
        <div class="bookName">{{ bookInfo.name }}</div>
        <div class="authorName">
          {{ bookInfo.name }} / {{ bookInfo.master }}
        </div>
        <div style="display: flex; margin-top: 20px; align-items: center">
          <div style="color: #606266">售价：</div>
          <div class="bookPrice">¥ {{ bookInfo.price }}</div>
        </div>
        <div style="display: flex; margin-top: 20px; align-items: center">
          <div style="color: #606266">发行日期:</div>
          <div style="color: #606266;margin-left:10px">{{ bookInfo.releasetime }}</div>
        </div>
        <div style="display: flex; margin-top: 20px; align-items: flex-end">
          <div style="color: #606266">库存数量：</div>
          <div>{{ bookInfo.num }}</div>
        </div>
        <div style="position: absolute; bottom: 0">
          <div style="display: flex; align-items: center">
            <div style="color: #606266">数量：</div>
            <el-input-number
              v-model="num"
              @change="handleChange"
              :step="1"
              :min="1"
              :max="bookInfo.num"
            ></el-input-number>
          </div>
          <div style="display: flex; margin-top: 40px">
            <el-button class="buyButton1" @click="addToCart(bookInfo)"
              >加入购物车</el-button
            >
            <el-button
              class="buyButton2"
              style="margin-left: 30px"
              @click="toSettle(bookInfo)"
              >立即购买</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <el-tabs type="card" class="tabs">
      <el-tab-pane label="评价">
        <div v-if="commentList.length > 0">
          <div v-for="(item) of commentList" :key="item.id">
              <div class="comment-wrapper">
                <div class="comment">
                <div class="avatar">
                  <img class="avatar" :src="'http://121.4.124.243/uploads/' + item.avatar" alt="">
                </div>
                <div>
                  <div class="user-name">{{item.uname || '匿名'}}</div>
                  <time class="user-time">{{item.time}}</time>
                </div>
                <div class="content-text">
                  {{item.content}}
                </div>
              </div>
              <div v-if="item.replies.length > 0" class="replay">专辑售卖商城({{item.replies[0].time}})：{{item.replies[0].content}}</div>
              </div>
          </div>
        </div>
        <div v-else class="empty">
          暂无评价
        </div>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import { request } from '../../api/http'
import { AlbumById, AddCart, findCommnetById } from '../../api/url'

export default {
  data () {
    return {
      loading: true,
      bookInfo: [],
      num: 1,
      cart: [],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      rate: 4.5,
      commentList: []
    }
  },
  created () {
    this.getInfo()
    this.getComment()
  },
  methods: {
    getComment () {
      request({
        url: findCommnetById,
        params: {
          pageSize: 100,
          pageNum: 1,
          aid: this.$route.query.ID
        },
        pack: ''
      })
        .then((res) => {
          console.log(res, 'comment')
          if (res.state) {
            this.commentList = res.data.list
          }
        })
    },
    getInfo () {
      request({
        url: AlbumById,
        params: {
          id: this.$route.query.ID
        },
        pack: ''
      })
        .then((res) => {
          this.bookInfo = res.data // 获取数据
          console.log('success')
          console.log(res, 898989)
        })
      this.loading = false
    },
    handleChange (value) {
      console.log(value)
    },
    goBack () {
      this.$router.go(-1)
    },
    addToCart (e) {
      if (this.$cookies.get('token')) {
        request({
          url: AddCart,
          pack: '',
          params: {
            aid: e.id,
            count: this.num
          },
          headersParams: {
            'token': this.$cookies.get('token')
          }
        })
          .then((res) => {
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
      } else {
        this.$confirm('您尚未登录！', 'smallFrog', {
          confirmButtonText: '去登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        })
      }
    },
    setCart () {
      let { id, avatar, name, master, price } = this.bookInfo
      let cart = {
        id, name, avatar, master, price, count: this.num
      }
      this.cart.push(cart)
    },
    toSettle () {
      if (this.$cookies.get('token')) {
        this.setCart()
        console.log(this.cart, 90099)
        this.$router.push({
          path: '/shopping/settle',
          query: {
            cart: this.cart,
            immediate: true
          }
        })
      } else {
        this.$confirm('您尚未登录！', 'smallFrog', {
          confirmButtonText: '去登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        })
      }
    }
  }
}
</script>

<style>
.replay {
  margin: 5px 0 0 200px;
  padding: 5px;
  background-color: #f5f5f5;
  color: #999;
  font-size: 13px;
}
.comment-wrapper {
  margin-bottom: 10px;
}
.comment {
  display: flex;
  align-items: center;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-name {
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
}
.user-time {
  color: #999;
  font-size: 12px;
}
.content-text {
  margin-left: 20px;
  font-size: 14px;
  color: #333;
}
.empty {
  color: #999;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}
.tabs {
  padding: 0 100px;
}
.bookInfo {
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 80px;
  display: flex;
}

.leftInfo {
  margin-left: 0;
  height: 350px;
  width: 500px;
}
.img {
  height: 250px;
  width: 450px;
  padding-left: 5px;
  margin: 0 auto;
}

.rightInfo {
  width: 400px;
  height: 400px;
  margin-left: 150px;
  padding-left: 30px;
}

.bookName {
  font-size: 23px;
  font-weight: 600;
}

.authorName {
  margin-top: 20px;
  color: #909399;
}

.bookPrice {
  color: #c00000;
  font-size: 23px;
  font-weight: 600;
}

.buyButton1 {
  width: 150px;
  background-color: #515a63;
  color: #ffffff;
  outline: none;
  border-color: #515a63;
  border-radius: 0;
}

.buyButton1:focus,
.buyButton1:hover {
  background-color: #787f86;
  border-color: #787f86;
  color: #ffffff;
  outline: none;
}

.buyButton2 {
  width: 150px;
  outline: none;
  border-radius: 0;
  color: #515a63;
}

.buyButton2:focus,
.buyButton2:hover {
  background-color: #515a63;
  border-color: #515a63;
  color: #ffffff;
  outline: none;
}
</style>
