<template>
  <div>
    <el-container>
      <div style="display: flex; margin-top: 40px; margin-left: 150px">
        <div>
          <h1 class="homeTitle">音乐专辑 Music</h1>
          <p class="content">正版音乐授权 听有保障的版权音乐</p>
          <el-button class="startBtn" @click="toCate()">SHOPPING</el-button>
        </div>
        <div>
          <img
            class="indexImg"
            src="https://s4.ax1x.com/2022/02/18/Hornwq.gif"
          />
        </div>
      </div>
    </el-container>

    <div class="recommend">
      <h1 class="recommendTitle">热门推荐</h1>
      <div
        class="recLine"
        data-wow-duration="2s"
        v-for="(books, index) in transRecBooks"
        :key="index"
      >
        <div v-for="(book, index) in books" :key="index">
          <el-card
            slot="reference"
            class="wow slideInUp card"
            :body-style="{ padding: '0px' }"
          >
            <img
              class="img"
              @click="toInfo(book)"
              :src="
                'http://www.xiaoqw.online/smallFrog-bookstore/img/' + book.img
              "
            />
            <div class="mask">
              <el-link class="name" @click="toInfo(book)" :underline="false">
                {{ book.Name }}
              </el-link>
              <div class="singer">歌手名字</div>
              <div class="time">2010发行日期</div>
              <el-rate
                class="rate"
                v-model="book.Commend"
                :colors="colors"
                disabled
              ></el-rate>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '../../api/http'
import { SellingAlbum } from '../../api/url'
// import animate from 'animate.css'
// import {WOW} from 'wowjs';

export default {
  data() {
    return {
      recBooks: [],
      transRecBooks: [],
    };
  },
  created() {
    // var address =
    //   "https://www.xiaoqw.online/smallFrog-bookstore/server/recommend.php";

    // axios.post(address).then((res) => {
    //   //这里是ES6的写法，get请求的地址
    //   this.recBooks = res.data; //获取数据
    //   console.log("success");
    //   console.log(this.recBooks);
    //   this.transRec();
    // });
    const params = {
      pageSize: 10,
      pageNum: 1,
      hotType: 3
    }
    request({
      url: SellingAlbum,
      params,
      pack: ''
    }).then(res => {
      console.log(res,33);
    })
  },
  // mounted() {
  // // 在项目加载完成之后初始化wow
  //     var options={
  //         //默认为true
  //         live:false
  //     };
  //     var wow=new WOW(options);
  // },
  methods: {
    transRec() {
      var Arr = [];
      for (var i = 0, idx = -1; i < this.recBooks.length; i++) {
        i % 4 == 0 && idx++;
        if (Object.prototype.toString.call(Arr[idx]) != "[object Array]")
          Arr[idx] = [];
        Arr[idx].push(this.recBooks[i]);
      }
      this.transRecBooks = Arr;
    },
    toInfo(e) {
      this.$router.push({
        path: "/bookInfo",
        query: {
          ID: e.ID,
        },
      });
    },
    toCate(e) {
      this.$router.push({
        path: "/category",
      });
    },
  },
};
</script>

<style scoped>
.homeTitle {
  width: 400px;
  color: #333333;
  font-size: 40px;
  font-weight: 600;
  text-align: left;
  margin-left: 200px;
}

.indexImg {
  width: 550px;
  margin-left: 200px;
}

.content {
  width: 400px;
  color: #333333;
  font-size: 18px;
  line-height: 35px;
  text-align: left;
  margin-left: 200px;
}

.startBtn {
  width: 180px;
  height: 50px;
  margin-left: 200px;
  margin-top: 80px;
  border-radius: 0;
  font-size: 16px;
  border: 0;
  outline: 0;
  background-color: #515a63;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.startBtn:focus,
.startBtn:hover {
  color: #ffffff;
  border-color: #787f86;
  background-color: #787f86;
}

.recommend {
  margin-top: 30px;
  padding-top: 30px;
  padding-bottom: 50px;
  /* background-color: #f8f9fb; */
  /* background-image: linear-gradient(#FFFFFF, #F2F2F7); */
}

.recommend .recommendTitle {
  color: #333333;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 50px;
}

.recommend .recLine {
  justify-content: center;
  display: flex;
}

.recommend .recLine .card {
  width: 280px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 40px;
  margin-right: 40px;
  /* border-radius: 15px; */
  position: relative;
  text-align: justify;
}

.recommend .recLine .card .img {
  width: 80%;
  display: block;
  cursor: pointer;
  margin: 0 auto;
  padding-top: 20px;
}

.recommend .recLine .card .mask {
  width: 100%;
  margin-top: 20px;
  background-color: #f8fafc;
}

.recommend .recLine .card .mask .name {
  padding-top: 14px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 14px;
  font-size: 20px;
}

.singer {
  margin-left: 20px;
  margin-top: -8px;
  color: #909399;
  font-size:16px;
}
.time {
  margin-left: 20px;
  color: #909399;
  font-size:16px;
  margin-top: 5px;
}
.recommend .recLine .card .mask .rate {
  text-align: center;
  padding: 0 10px 14px 10px;
  margin-top: 10px;
}

.el-link.el-link--default {
  color: #4f6e9d;
}

.el-link.el-link--default:hover {
  color: #7e9dca;
}
</style>
