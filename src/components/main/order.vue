<template>
    <div>
        <el-row type="flex" align="middle">
            <el-col :span="4">
                <img class="bannerLogo" src="https://s3.bmp.ovh/imgs/2022/02/91b9aa52ebbb517a.png">
            </el-col>
            <el-col :span="20">
                <div class="banner">
                    <div class="prompt_a">我的订单</div>
                </div>
            </el-col>
        </el-row>
        <div class="cart_line"></div>

        <div v-if="this.cart[0]">
            <div class="list">
                <el-row type="flex" align="middle">
                    <el-col :span="3" class="title">商品图片</el-col>
                    <el-col :span="5" class="title">商品名称</el-col>
                    <el-col :span="3" class="title">单价</el-col>
                    <el-col :span="3" class="title">数量</el-col>
                    <el-col :span="3" class="title">小计</el-col>
                    <el-col :span="3" class="title">订单状态</el-col>
                    <el-col :span="7" class="title">操作</el-col>
                </el-row>

                <div v-for="(book, index) in cart" :key="index">
                    <el-row type="flex" align="middle"  >
                        <el-col :span="3" class="bookRow">
                            <img class="bookImg" :src="'http://121.4.124.243/uploads/' + book.avatar">
                        </el-col>
                        <el-col :span="5" class="bookRow">{{ book.name }}</el-col>
                        <el-col :span="3" class="bookRow">{{ book.price }}</el-col>
                        <el-col :span="3" class="bookRow">{{ book.count }}</el-col>
                        <el-col :span="3" class="bookRow">{{ book.price }}</el-col>
                        <el-col :span="3" class="bookRow">{{ getState(book.state) }}</el-col>
                        <el-col :span="7" class="bookRow">
                            <el-button v-if="book.state === 3" type="success" round @click="checkGoods(book)">确认收货</el-button>
                            <el-button v-if="book.state >= 0 && book.state <= 4" type="info" round @click="requestRefund(book)">申请退款</el-button>
                            <el-button v-if="book.state === 5" type="success" round @click="openComment(book)">评价</el-button>
                            <el-button type="success" round @click="getDetail(book)">详情</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div class="summary">
                <el-row type="flex" align="middle">
                    <el-col :span="6">
                        <div class="number">共 {{ this.cart.length }} 个订单</div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div v-if="!this.cart[0]">
            <div class="list">
                <el-row type="flex" align="middle">
                    <el-col :span="3" class="title">商品图片</el-col>
                    <el-col :span="9" class="title">商品名称</el-col>
                    <el-col :span="3" class="title">单价</el-col>
                    <el-col :span="3" class="title">数量</el-col>
                    <el-col :span="3" class="title">小计</el-col>
                    <el-col :span="3" class="title">操作</el-col>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-col :span="24" class="title">暂无订单噢，赶紧去购买吧！</el-col>
                </el-row>
            </div>

            <div class="summary">
                <el-row type="flex" align="middle">
                    <el-col :span="6">
                        <div class="number">共 0 个订单</div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div v-if="showDetail">
            <el-dialog title="订单详情" class="dialog" :visible.sync="showDetail" width="35%" @close="showDetail=false">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="'http://121.4.124.243/uploads/' + order.avatar" class="image">
                    <div style="padding: 14px;">
                        <span>{{order.name+'/'+order.master}}</span>
                        <div class="bottom clearfix">
                        <time class="time">{{ '下单时间：' + order.time }}</time>
                        </div>
                    </div>
                    <div style="padding: 5px 14px;">
                        数量：{{order.count}}
                    </div>
                    <div style="padding: 5px 14px;">
                        小计：{{order.price}}
                    </div>
                    <div style="padding: 5px 14px;">
                        收货人信息：{{order.uname}} <span style="color: #999"> / </span> {{order.phone}}<span style="color: #999"> / </span>{{order.address}}
                    </div>
                </el-card>
            </el-dialog>
        </div>
        <div v-if="showComment">
            <el-dialog title="发布评价" class="dialog" :visible.sync="showComment" width="35%" @close="showComment=false">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入您的评价，体验不错给个好评吧~"
                    v-model.trim="comment">
                </el-input>
                <el-button style="margin-top:20px" type="success" round @click="saveComment">发表</el-button>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { request } from '../../api/http'
import { AllOrder, saveComment, refund, sureGoods } from '../../api/url'

export default {
  inject: ['reload'],
  data () {
    return {
      cart: [],
      count: 0,
      totalPrice: 0,
      showDetail: false,
      order: {},
      comment: '',
      showComment: false
    }
  },
  created () {
    this.getAllOrder()
  },
  methods: {
    getDetail (order) {
      this.order = order
      this.showDetail = true
    },
    checkGoods (order) {
      request({
        url: sureGoods,
        params: {
          id: order.id
        },
        pack: '',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).then(res => {
        if (res.state) {
          this.$message({
            showClose: true,
            message: '收货成功',
            type: 'success',
            center: true
          })
          this.reload()
        }
      })
    },
    getState (state) {
      if (state === 0) {
        return '已付款，待发货'
      } else if (state === 3) {
        return '已发货'
      } else if (state === 4) {
        return '确认收货'
      } else if (state === 5) {
        return '交易完成'
      } else if (state === 6) {
        return '退款中'
      } else if (state === 7) {
        return '订单关闭'
      }
    },
    requestRefund (order) {
      request({
        url: refund,
        params: {
          id: order.id
        },
        pack: '',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).then(res => {
        if (res.state) {
          this.$message({
            showClose: true,
            message: '请求退款成功！',
            type: 'success',
            center: true
          })
          this.reload()
        } else {
          this.$message({
            showClose: true,
            message: '失败',
            type: 'error',
            center: true
          })
        }
      })
    },
    openComment (order) {
      this.showComment = true
      this.currentOrder = order
    },
    saveComment () {
      if (!this.comment) {
        this.$message({
          showClose: true,
          message: '内容不能为空',
          type: 'warning',
          center: true
        })
        return
      }
      request({
        url: saveComment,
        params: {
          aid: this.currentOrder.aid,
          oid: this.currentOrder.id,
          content: this.comment
        },
        pack: '',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).then(res => {
        if (res.state) {
          this.$message({
            showClose: true,
            message: '评价成功！',
            type: 'success',
            center: true
          })
          this.currentOrder = ''
          this.showComment = false
        } else {
          this.$message({
            showClose: true,
            message: '失败',
            type: 'error',
            center: true
          })
        }
      })
    },
    getAllOrder () {
      request({
        url: AllOrder,
        params: {

        },
        pack: '',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).then(res => {
        if (res.state) {
          this.cart = res.data
        }
      })
    },
    cartDelete (e) {
      var address = 'https://www.xiaoqw.online/smallFrog-bookstore/server/cartDelete.php'

      axios.post(address, {
        user_ID: e.user_ID,
        book_ID: e.book_ID
      }).then(response => {
        console.log('删除成功')
        this.$message({
          showClose: true,
          message: '删除成功！',
          type: 'success',
          center: true
        })
        this.reload()
      })
    },
    toSettle () {
      if (!this.cart[0]) {
        this.$message({
          showClose: true,
          message: '购物车里还没有商品噢！',
          type: 'warning',
          center: true
        })
      } else {
        this.$router.push({
          path: '/shopping/settle',
          query: {
            cart: this.cart
          }
        })
      }
    }
  }
}
</script>

<style scoped>
    .bannerLogo {
        width: 60%;
        margin-left: 100px;
        margin-top: -25px;
        padding-bottom: 13px;
        padding-top: 13px;
    }

    .banner {
        width: 100%;
        height: 80px;
        display: flex;
        margin-bottom: 20px;
    }

    .banner .prompt_a {
        height: 80px;
        line-height: 80px;
        font-weight: bold;
        font-size: 24px;
        margin-left: 40px;
    }

    .banner .prompt_b {
        height: 80px;
        line-height: 90px;
        font-size: 14px;
        color: #777;
        margin-left: 40px;
    }

    .cart_line {
        width: 100%;
        height: 2px;
        background: #515a63;
    }

    .list {
        width: 85%;
        margin: 0 auto;
        background-color: #f5f5f5;
        text-align: center;
    }

    .list .title {
        height: 100px;
        line-height: 100px;
        font-weight: bold;
    }

    .list .bookRow {
        height: 120px;
        line-height: 90px;
    }

    .list .bookRow .bookImg {
        width: 60px;
    }

    .summary {
        width: 85%;
        margin: 0 auto;
        height: 60px;
        line-height: 60px;
        background-color: #f5f5f5;
        text-align: center;
        margin-top: 20px;
    }

    .summary .number {
        color: #515a63;
    }

    .summary .price {
        margin-right: 40px;
        float: right;
    }

    .summary .settlement {
        height: 60px;
        background-color: #515a63;
        color: #ffffff;
        cursor: pointer;
    }

    .summary .settlement:hover {
        background-color: #787f86;
    }
    .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
</style>
