<template>
    <div>
        <el-row>
            <el-col :span="12">
                <img class="loginImg" src="https://s3.bmp.ovh/imgs/2022/02/259f25888bd5232e.jpg">
            </el-col>

            <el-col :span="12">
                <div class="title"><img class="head" src="../../../static/head1.gif"></div>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0">
                    <div class="myInput username1">
                        <el-form-item prop="tel">
                            <el-input class="search1 search2 search3" prefix-icon="el-icon-user" v-model="ruleForm.tel" placeholder="请输入手机号" :clearable="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="myInput password">
                        <el-form-item prop="pass">
                            <el-input class="search1 search2 search3" prefix-icon="el-icon-magic-stick" placeholder="请输入密码" v-model="ruleForm.pass" show-password></el-input>
                        </el-form-item>
                    </div>

                    <div class="login">
                        <el-form-item>
                            <el-button class="logBtn" @click="submitForm('ruleForm')">登录</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="link">
                    <el-link type="info" @click="toReg()">没有账号?去注册!</el-link>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { Login } from '../../api/url'
import { request } from '../../api/http'

export default {
  data () {
    // <!--验证手机号是否合法-->
    let checkTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(' '))
      } else if (!this.checkMobile(value)) {
        callback(new Error(' '))
      } else {
        callback()
      }
    }
    // <!--验证密码-->
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(' '))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }

    return {
      ruleForm: {
        pass: '',
        tel: ''
      },
      rules: {
        pass: [{
          validator: validatePass,
          trigger: 'change'
        }],
        tel: [{
          validator: checkTel,
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    // 验证手机号
    checkMobile (str) {
      let re = /^1\d{10}$/
      if (re.test(str)) {
        return true
      } else {
        return false
      }
    },
    // <!--提交登录-->
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: Login,
            params: {
              phone: this.ruleForm.tel,
              pass: this.ruleForm.pass
            },
            pack: ''
          }).then(res => { // 用户名和密码将转为json传到后台接口
            console.log(res)
            if (res.state) { // 显示登录结果
              console.log('登录成功')
              this.$message({
                showClose: true,
                message: '登录成功！',
                type: 'success',
                center: true
              })

              this.$cookies.set('token', res.data.token)
              this.$cookies.set('user_ID', res.data.id)
              if (res.data.avatar) {
                this.$cookies.set('Avatar', `http://121.4.124.243/uploads/${res.data.avatar}`)
              }

              this.$router.push({
                path: '/home'
              })
            } else {
              console.log('账号或密码错误！')
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
                center: true
              })
            }
          })
        } else {
          console.log('账号或密码错误！')
          return false
        }
      })
    },
    toReg () {
      this.$router.push({
        path: '/register'
      })
    }
  }
}
</script>

<style>
    .logo {
        margin: 0 auto;
    }

    .loginImg {
        width:70%;
        margin: 0 auto;
        float: right;
    }

    /* ------------------------------ */

    .title {
        margin-top: 5%;
        width: 100%;
        text-align: center;
    }

    .head {
        width: 350px;
    }

    .username1 {
        width: 40%;
        margin-top: 10%;
        margin-left: auto;
        margin-right: auto;
    }

    .password {
        width: 40%;
        margin-top: 30px;
        margin-left: auto;
        margin-right: auto;
    }

    .login {
        margin-top: 8%;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }

    .logBtn {
        width: 150px;
        height: 40px;
        border-radius: 25px;
        border: none;
        outline: none;
        background-color: #515a63;
        color: #FFFFFF;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .logBtn:focus,
    .logBtn:hover {
        color: #FFFFFF;
        border-color: #787f86;
        background-color: #787f86;
    }

    .logBtn:active {
        color: #FFFFFF;
        border-color: #787f86;
        outline: 0;
    }

    .link {
        margin-top: 10%;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }
</style>
