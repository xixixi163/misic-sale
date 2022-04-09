<template>
    <div v-if="showDialog" class="address">
        <el-dialog title="收货地址" class="dialog" :visible.sync="showDialog" width="30%" @close="closeModal">
            <div class="box__wrapper">
                <div class="add-address" @click="addAddress">
                    <i class="el-icon-circle-plus circle-plus"></i>  新增收货地址
                </div>
                    <div v-for="(address, index) in addressList" :label="address.id" :key="address.id">
                        <div class="address-card" @click="choose(index, address)">
                            <div :class="[{ 'active' : index === activesIndex}, 'checkbox']"></div>
                            <div>
                                <div class="user-info">
                                    <span class="user-name">{{address.name}}</span>
                                    <span class="user-phone">{{address.phone}}</span>
                                </div>
                                <div class="user-address">
                                    {{address.address}}
                                </div>
                            </div>
                            <div class="edit">
                                <i class="el-icon-edit icon-edit" @click.stop="editAddress(address)"></i>
                                <i class="el-icon-delete" @click.stop="deleteAddress(address)"></i>
                            </div>
                        </div>
                    </div>
            </div>
        </el-dialog>
         <!-- 收货信息编辑弹出框 -->
      <el-dialog :title="editDialog" :visible.sync="editVisible" width="35%">
        <el-form
          label-position="left"
          :rules="rules"
          ref="userInfo"
          :model="userInfo"
          label-width="100px"
        >
          <el-form-item label="名字" prop="name">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model.number="userInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="address">
            <el-input type="textarea" v-model="userInfo.address"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveAddress('userInfo')" plain
            >{{editDialogText}}</el-button
          >
          <el-button type="danger" @click="editVisible = false" plain
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { request } from '../../api/http'
import { ModifyReceiveAddress, RemoveReceiveAddress, AddReceiveAddress } from '../../api/url'
export default {
  name: 'ReceiveAddress',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    addressList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else {
        if (!this.checkMobile(value)) {
          callback(new Error('请输入正确的手机号码'))
        }
        callback()
      }
    }
    return {
      activesIndex: 0,
      showBox: false,
      userInfo: {},
      editVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, required: true, message: '请输入收货人手机号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入收货地址', trigger: 'blur' },
          { min: 5, max: 40, message: '至少输入 5 个字符', trigger: 'blur' }
        ]
      },
      showDialog: false,
      addFlag: false
    }
  },
  computed: {
    editDialog () {
      return this.addFlag ? '新增收货地址' : '修改收货地址'
    },
    editDialogText () {
      return this.addFlag ? '新增' : '修改'
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.showDialog = val
      }
    }
  },
  created () {

  },
  methods: {
    choose (index, address) {
      this.activesIndex = index
      this.$emit('choose-address', address)
    },
    addAddress () {
      this.userInfo = {}
      this.editVisible = true
      this.addFlag = true
    },
    addAddressFetch () {
      request({
        url: AddReceiveAddress,
        params: {
          address: this.userInfo.address,
          phone: this.userInfo.phone,
          name: this.userInfo.name
        },
        pack: '',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).then(res => {
        this.addFlag = false
        console.log(res, 12)
        if (res.state) {
          this.$message({
            showClose: true,
            message: '添加成功！',
            type: 'success',
            center: true
          })
          this.userInfo = {}
          this.editVisible = false
          this.$emit('update-address')
        }
      })
    },
    deleteAddress (address) {
      this.userInfo = {}
      request({
        url: RemoveReceiveAddress,
        params: {
          id: address.id
        },
        pack: '',
        headersParams: {
          token: this.$cookies.get('token')
        }
      }).then(res => {
        if (res.state) {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
            center: true
          })
          this.$emit('update-address')
        } else {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error',
            center: true
          })
        }
      })
    },
    // 验证手机号
    checkMobile (str) {
      let re = /^1\d{10}$/
      if (re.test(str)) {
        return true
      } else {
        return false
      }
    },
    closeModal () {
      this.$emit('input', false)
    },
    editAddress (address) {
      this.userInfo = address
      this.editVisible = true
      this.addFlag = false
    },
    saveAddress (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addFlag) {
            this.addAddressFetch()
            return
          }
          request({
            url: ModifyReceiveAddress,
            params: {
              id: this.userInfo.id,
              address: this.userInfo.address,
              phone: this.userInfo.phone,
              name: this.userInfo.name
            },
            pack: '',
            headersParams: {
              token: this.$cookies.get('token')
            }
          }).then(res => {
            if (res.state) {
              this.$message({
                showClose: true,
                message: '修改成功！',
                type: 'success',
                center: true
              })
              this.userInfo = {}
              this.$emit('update-address')
              this.editVisible = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.box__wrapper {
    width: 350px;
    height: 500px;
    background-color: #fff;
    padding: 10px;
}
.add-address {
    height: 30px;
}
.address-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 290px;
    padding: 10px;
    border-bottom: 1px solid #999;
}
.icon-edit {
    margin-right: 5px;
}
.user-info {
    margin-bottom: 5px;
}
.user-name {
    font-weight: 600;
    color: #333;
    font-style: 16px;
}
.user-phone {
    color: #999;
    font-size: 12px;
}
.circle-plus {
    color: rgb(85, 150, 248);
}
.checkbox {
    width: 15px;
    height: 15px;
    border-radius: 3px;
    border: 1px solid #999;
    cursor: pointer;
}
.active {
    position: relative;
    background: #13a3f7;
    border: 1px solid #13a3f7;
}
.active::after {
    content: '';
    position: absolute;
    left: 40%;
    height: 8px;
    width: 3px;
    background-color: opacity;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    transform: rotate(45deg);
}
</style>
