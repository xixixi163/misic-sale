<template>
    <div>
        <el-row>
            <el-col :span="12">
                <img class="regImg" src="https://s3.bmp.ovh/imgs/2022/02/259f25888bd5232e.jpg">
            </el-col>

            <el-col :span="12">
                <div class="title"><img class="head" src="../../../static/head2.gif"></div>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
                    <div class="myInput username2">
                        <el-form-item prop="tel">
                            <el-input class="search1 search2 search3" prefix-icon="el-icon-user" v-model="ruleForm.tel" placeholder="请输入手机号" clearable="true"></el-input>
                        </el-form-item>
                    </div>
                    <div class="myInput password">
                        <el-form-item prop="pass">
                            <el-input class="search1 search2 search3" prefix-icon="el-icon-magic-stick" placeholder="请输入密码" v-model="ruleForm.pass" show-password></el-input>
                        </el-form-item>
                    </div>
                    <div class="myInput password">
                        <el-form-item prop="checkPass">
                            <el-input class="search1 search2 search3" prefix-icon="el-icon-magic-stick" placeholder="确认密码" v-model="ruleForm.checkPass" show-password></el-input>
                        </el-form-item>
                    </div>

                    <div class="login">
                        <el-form-item prop="checkPass">
                            <el-button class="logBtn" @click="submitForm('ruleForm')">注册</el-button>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="link">
                    <el-link type="info" @click="toLog()">已有账号?去登录!</el-link>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { Register } from '../../api/url'
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
    let validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(' '))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    // <!--二次验证密码-->
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(' '))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(' '))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        tel: ''
      },
      rules: {
        pass: [{
          validator: validatePass1,
          trigger: 'change'
        }],
        checkPass: [{
          validator: validatePass2,
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
    // <!--提交注册-->
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: Register,
            params: {
              name: '',
              phone: this.ruleForm.tel,
              pass: this.ruleForm.pass
            },
            pack: ''
          }).then(res => { // 用户名和密码将转为json传到后台接口
            if (res.state) { // 显示登录结果
              console.log('注册成功')
              this.$message({
                showClose: true,
                message: '注册成功！',
                type: 'success',
                center: true
              })

              this.$router.push({
                path: '/login'
              })
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error',
                center: true
              })
            }
          })
        } else {
          console.log('抱歉！注册失败！请稍后重试！')
          return false
        }
      })
    },
    toLog () {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style>
    .logo {
        /* margin-top: 20%; */
        margin: 0 auto;
    }

    .regImg {
        width: 700px;
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

    .username2 {
        width: 40%;
        margin-top: 5%;
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

    .link {
        margin-top: 10%;
        margin-bottom: 50px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }
</style>
