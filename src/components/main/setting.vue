<template>
    <div class="setting">
        <div class="pageHeader">
            <el-page-header @back="goBack" content="账号设置"></el-page-header>
        </div>
        <div v-loading="loading" class="setting__wrapper">
            <el-upload
                class="upload-avatar"
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture"
                :auto-upload="false"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="1"
                :on-exceed="handleExceed"
                :on-change="handleChange">
                <div class="user-avatar flex">
                    <div>
                        <div class="info_text">头像：</div>
                        <img :src="avatarUrl" alt="" class="avatar">
                    </div>
                    <div class="edit_text">更换头像</div>
                </div>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <div class="username flex">
                <div>
                    <div class="info_text">用户名：</div>
                    <div>花花</div>
                </div>
                <div class="edit_text" @click="updateUserName">编辑</div>
            </div>
            <div class="user-phone">
                <div class="info_text">手机号：</div>
                <div>1885944434</div>
            </div>
            <div class="user-pass flex">
                <div class="">
                    <div class="info_text">密码：</div>
                    <div>12345</div>
                </div>
                <div class="edit_text" @click="updatePassWord">编辑</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      avatarUrl: ''
    }
  },
  created () {

  },
  methods: {
    getUserInfo () {

    },
    updateAvatar () {

    },
    updateUserName () {

    },
    updatePassWord () {

    },
    handleChange (file, fileList) {
      this.avatarUrl = file.url
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
    border-bottom: 1px solid #EEEEEE;
    color: #353535;
}
.upload-avatar {
    width: 100%;
}
.user-phone {
    padding: 20px 40px;
    border-bottom: 1px solid #EEEEEE;
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
</style>
