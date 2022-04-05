<template>
  <div class="setting">
    <div class="pageHeader">
      <el-page-header
        @back="goBack"
        content="账号设置"
      ></el-page-header>
    </div>
    <div
      v-loading="loading"
      class="setting__wrapper"
    >
      <el-upload
        class="upload-avatar flex"
        action="#"
        list-type="picture"
        :show-file-list="false"
        :limit="1"
        :on-change="handleChange"
      >
        <div
          v-if="avatarUrl"
          class="user-avatar"
        >
          <!-- <div class="info_text">头像：</div> -->
          <img
            :src="avatarUrl"
            alt=""
            class="avatar"
          >
        </div>
        <i
          v-else
          class="el-icon-plus avatar-uploader-icon"
        ></i>
        <div class="edit_text">更换头像</div>
        <div
          slot="tip"
          class="el-upload__tip"
        >只能上传图片文件，且不超过5M</div>
      </el-upload>
      <div class="username flex">
        <div>
          <div class="info_text">用户名：</div>
          <div>{{userInfo.name}}</div>
        </div>
        <el-button
          class="edit_text"
          type="text"
          @click="updateUserName"
        >编辑</el-button>
      </div>
      <div class="user-phone">
        <div class="info_text">手机号：</div>
        <div>{{userInfo.phone}}</div>
      </div>
      <div class="user-pass flex">
        <div class="">
          <div class="info_text">密码：</div>
          <div>{{userInfo.pass}}</div>
        </div>
        <div
          class="edit_text"
          @click="updatePassWord"
        >编辑</div>
      </div>
    </div>
    <div
      v-if="showMask"
      class="mask"
    >
      <div class="popup">
        <i @click="closeMask"></i>
        <el-input
          class="search1 search2 search3 popun-content"
          prefix-icon="el-icon-magic-stick"
          placeholder="请输入密码"
          v-model="pass"
          show-password
        ></el-input>
        <el-input
          class="search1 search2 search3 popun-content"
          prefix-icon="el-icon-magic-stick"
          placeholder="确认密码"
          v-model="checkPass"
          show-password
        ></el-input>
        <div class="popun-content pass-tip">{{passTip}}</div>
        <div
          class="popun-close"
          @click="closeMask"
        >关闭</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ModifyAvatar, ModifyUser, UserById } from '../../api/url'
import { request } from '../../api/http'
import myreferto from '../../api/formdata'
export default {
  data () {
    return {
      loading: false,
      avatarUrl: '',
      userInfo: {
        name: '默认',
        pass: '123456',
        phone: '17723452345'
      },
      pass: '',
      checkPass: '',
      showMask: false
    }
  },
  computed: {
    passTip () {
      return this.pass === '' || this.checkPass === '' ? '请输入密码' : this.pass !== this.checkPass ? '密码不一致' : ''
    }
  },
  created () {
    // this.avatarUrl = `http://121.4.124.243/uploads/${this.avatar}`
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      request({
        url: UserById,
        params: {
          id: this.$cookies.get('user_ID')
        },
        headersParams: {
          token: this.$cookies.get('token')
        },
        pack: ''
      }).then(res => {
        if (res.data.state) {
          console.log(res, 55)
        }
      })
    },
    updateUserName () {
      this.$prompt('请输入用户名', '编辑', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9_]{4,10}/,
        inputErrorMessage: '用户名由中英文、数字、_组成，长度4-10位'
      }).then(({ value }) => {
        // this.$message({
        //   type: 'success',
        //   message: '你的邮箱是: ' + value
        // })
        this.userInfo.name = value
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // })
      })
    },
    updatePassWord () {
      this.showMask = true
    },
    async handleChange (file, fileList) {
      this.avatarUrl = file.url
      const files = file.raw
      const params = [{ file: files }]
      // eslint-disable-next-line new-cap
      const uploading = await new myreferto(params).appfrom()
      request({
        url: ModifyAvatar,
        params: uploading,
        requestType: 'multipart',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).finaly(() => {
        // eslint-disable-next-line new-cap
        new myreferto(params).men()
      })
    },
    closeMask () {
      this.showMask = false
    }
  }
}
</script>

<style>
.setting__wrapper {
  height: 350px;
  width: 35%;
  margin: 0 auto;
}
.edit_text {
  color: #1472ff;
  font-size: 14px;
  cursor: pointer;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid #eeeeee;
  color: #353535;
}
.upload-avatar {
  width: 100%;
}
.user-phone {
  padding: 20px 40px;
  border-bottom: 1px solid #eeeeee;
}
.info_text {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #999;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}
.popup {
  position: absolute;
  width: 400px;
  height: 200px;
  padding: 20px;
  background-color: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
}
.popun-content {
  margin-bottom: 20px;
}
.popun-close {
  width: 70px;
  height: 30px;
  color: #999;
  text-align: center;
  line-height: 30px;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin: 0 auto;
}
.pass-tip {
  font-size: 12px;
  color: #e20707;
}
</style>
