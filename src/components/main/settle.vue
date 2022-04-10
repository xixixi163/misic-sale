<template>
  <div>
    <div class="settle">
      <div class="viewBox">
        <div class="title">
          <div class="slogan">填写并核对订单信息</div>
          <!-- <el-button class="submit" type="danger" @click="toPay(userInfo)"
            >提交订单</el-button
          > -->
        </div>
        <!-- <el-divider></el-divider>
                <el-row type="flex" align="middle">
                    <el-col :span="4">
                        <el-button icon="el-icon-caret-left" class="back" @click="goBack()">上一步</el-button>
                    </el-col>
                    <el-col :span="20">
                        <el-steps :active="1" finish-status="success" simple>
                            <el-step title="购物车" icon="el-icon-s-goods" @click="toCart()"></el-step>
                            <el-step title="下单" icon="el-icon-s-claim"></el-step>
                            <el-step title="付款" icon="el-icon-s-finance"></el-step>
                            <el-step title="出库" icon="el-icon-s-home"></el-step>
                            <el-step title="成功交易" icon="el-icon-success"></el-step>
                        </el-steps>
                    </el-col>
                </el-row> -->
        <el-divider></el-divider>

        <div class="commodity">
          <el-row type="flex" align="middle">
            <el-col :span="3" class="cTitle">专辑图片</el-col>
            <el-col :span="9" class="cTitle">专辑名称</el-col>
            <el-col :span="6" class="cTitle">歌手</el-col>
            <el-col :span="6" class="cTitle">单价</el-col>
            <el-col :span="6" class="cTitle">数量</el-col>
          </el-row>
        </div>

        <div v-if="this.cart[0]">
          <div class="commodity" v-for="(book, index) in cart" :key="index">
            <el-row type="flex" align="middle">
              <el-col :span="3">
                                <img class="bookImg" :src="'http://121.4.124.243/uploads/' + book.avatar">
                            </el-col>
              <el-col :span="9">{{ book.name }}</el-col>
              <el-col :span="6">{{ book.master }}</el-col>
              <el-col :span="6">{{ book.price }}</el-col>
              <el-col :span="6">{{ book.count }}</el-col>
            </el-row>
          </div>
          <el-divider></el-divider>

          <div class="orderInfo">
            <div class="left">
              <div class="infoTitle">收货信息</div>
              <div class="info">名字：{{ userInfo.name }}</div>
              <div class="info">电话：{{ userInfo.phone }}</div>
              <div class="info">地址：{{ userInfo.address }}</div>
            </div>
            <el-button class="modify" type="info" @click="chooseReceive" plain
              >选择收获地址</el-button
            >
          </div>
          <el-divider></el-divider>

          <div class="settleFooter">
            <div class="leftImg">
              <img class="settleImg" src="../../../static/orderConfirm.png" />
            </div>
            <div class="total">
              <div class="postage">商品总额：{{ totalPrice }} 元</div>
              <div class="postage">运费：{{ postage }} 元</div>
              <div class="payPrice">
                应付金额：{{ totalPrice + postage }} 元
              </div>
              <el-button class="submit" type="primary" @click="toPay(userInfo)"
            >提交订单</el-button
          >
            </div>
          </div>
        </div>

        <div v-if="!this.cart[0]">
          <el-row type="flex" align="middle">
            <el-col :span="24" style="text-align: center">暂无商品</el-col>
          </el-row>
          <el-divider></el-divider>

          <div class="orderInfo">
            <div class="left">
              <div class="infoTitle">收货信息：无</div>
            </div>
            <el-button class="modify" type="info" @click="modify()" plain
              >修改</el-button
            >
          </div>
          <el-divider></el-divider>

          <div class="settleFooter">
            <div class="leftImg">
              <img class="settleImg" src="../../../static/orderConfirm.png" />
            </div>
            <div class="total">
              <div class="postage">商品总额：0 元</div>
              <div class="postage">运费：0 元</div>
              <div class="payPrice">应付金额：0 元</div>
            </div>
          </div>
        </div>
      </div>

      <receive-address v-model="showReceive" :address-list="addressList" @update-address="getReceiveInfo" @choose-address="choosedAddress" />
    </div>
  </div>
</template>

<script>
import { request } from '../../api/http'
import { SeeReceiveAddress, calcCart, saveOrder } from '../../api/url'
import ReceiveAddress from '../receive-address/index'

export default {
  inject: ['reload'],
  components: {
    ReceiveAddress
  },
  data () {
    return {
      input: '',
      userInfo: {},
      postage: 0,
      cart: [],
      count: 0,
      totalPrice: 0,
      editVisible: false,
      showReceive: false,
      addressList: []
    }
  },
  async created () {
    let count = 0
    let totalPrice = 0

    this.cart = this.$route.query.cart

    for (let i = 0; i < this.cart.length; i++) {
      count += parseFloat(this.cart[i].count)
      totalPrice += parseFloat(this.cart[i].price * this.cart[i].count)
    }
    this.count = count
    this.totalPrice = totalPrice

    await this.getReceiveInfo()
  },
  methods: {
    choosedAddress (address) {
      this.userInfo = address
    },
    getReceiveInfo () {
      return request({
        url: SeeReceiveAddress,
        pack: '',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).then(res => {
        if (res.state) {
          this.addressList = res.data
          this.userInfo = res.data[0]
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    toCart () {
      this.$router.push({
        path: '/shopping/cart'
      })
    },
    modify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('修改成功！', valid)
          this.$message({
            showClose: true,
            message: '修改成功！',
            type: 'success',
            center: true
          })
          this.editVisible = false
        } else {
          console.log('error!')
          return false
        }
      })
    },
    toPay (e) {
      if (!this.cart[0]) {
        this.$message({
          showClose: true,
          message: '无订单信息！',
          type: 'warning',
          center: true
        })
      } else {
        let url = calcCart
        let params = {
          rid: e.id
        }
        if (this.$route.query.immediate) {
          url = saveOrder
          params = {
            aid: this.cart[0].id,
            count: this.count,
            price: this.totalPrice,
            rid: e.id,
            state: 0
          }
        }
        request({
          url,
          params,
          pack: '',
          headersParams: {
            token: this.$cookies.get('token')
          }
        }).then(res => {
          if (res.state) {
            this.$message({
              showClose: true,
              message: '结算成功',
              type: 'success',
              center: true
            })
            this.$router.push({
              path: '/order'
            })
          } else {
            this.$message({
              showClose: true,
              message: '系统异常，请稍后操作',
              type: 'error',
              center: true
            })
          }
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '系统异常，请稍后操作',
            type: 'error',
            center: true
          })
        })
      }
    },
    chooseReceive () {
      console.log('kkkkkkk')
      this.showReceive = true
    }
  }
}
</script>

<style scoped>
.settle {
  width: 80%;
  margin: 0 auto;
  padding-top:-50px ;
  /* background-color: #f5f5f5; */
}

.settle .viewBox {
  width: 80%;
  margin: 0 auto;
}

.settle .viewBox .title {
  height: 100px;
  display: flex;
  align-items: center;
}

.settle .viewBox .title .slogan {
  width: 90%;
  height: 100px;
  line-height: 100px;
  font-size: 24px;
  color: #303133;
  float: left;
  margin: 0 auto;
}

.settle .viewBox .title .submit {
  width: 150px;
  height: 50px;
  border-radius: 0;
  font-size: 16px;
}

.settle .viewBox .back {
  width: 100px;
  border-radius: 0;
}

.settle .viewBox .commodity {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 10px;
}

.settle .viewBox .commodity .cTitle {
  height: 60px;
  line-height: 40px;
  font-weight: bold;
}

.settle .viewBox .commodity .bookImg {
  width: 120px;
}

.settle .viewBox .orderInfo {
  height: 180px;
  display: flex;
  align-items: center;
}

.settle .viewBox .orderInfo .left {
  width: 90%;
  height: 180px;
  line-height: 180px;
  font-size: 18px;
  color: #606266;
}

.settle .viewBox .orderInfo .left .infoTitle {
  width: 90%;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #303133;
  margin-bottom: 30px;
}

.settle .viewBox .orderInfo .left .info {
  width: 90%;
  height: 40px;
  line-height: 40px;
  font-size: 17px;
  color: #606266;
}

.settle .viewBox .orderInfo .modify {
  width: 150px;
  height: 40px;
  border-radius: 0;
  font-size: 16px;
}

.settle .viewBox .settleFooter {
  width: 100%;
  display: flex;
}

.settle .viewBox .settleFooter .leftImg {
  width: 80%;
  /* float: left; */
}

.settle .viewBox .settleFooter .settleImg {
  width: 150px;
  float: left;
}

.settle .viewBox .settleFooter .total {
  width: 20%;
  height: 150px;
  align-items: center;
}

.settle .viewBox .settleFooter .total .postage {
  margin-bottom: 10px;
  float: right;
}

.settle .viewBox .settleFooter .total .payPrice {
  margin-top: 30px;
  font-size: 20px;
  color: #4f6e9d;
  float: right;
}
.submit {
  margin-top: 10px;
  float: right;
}
</style>
