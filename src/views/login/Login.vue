<template>
  <div class="login">
    <div class="login-box">
      <div class="admin-logo">
        <img src="~assets/img/logo.png" alt="" />
      </div>
      <el-form ref="loginForm" class="rule-form" :rules="rules" :model="admin">
        <el-form-item prop="userName">
          <el-input type="text"  v-model="admin.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"  v-model="admin.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item>
            <div class="btn">
                <el-button type="primary" @click="adminLogin">
                    登录
                </el-button>
                <el-button type="info" @click="resetForm">重置</el-button>
            </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reqLogin } from 'http/api'
export default {
  data() {
    return {
      admin: {
         username: '',
         password: ''
      },
      rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
   adminLogin() {
       this.$refs.loginForm.validate(async result => {
           if(!result) return;
           const { meta, data} = await reqLogin(this.admin);
           if(meta.status != 200) return this.$message.error(meta.msg);
           this.$message.success(meta.msg);
           sessionStorage.setItem('token', data.token);
           this.$store.commit('changeAdminInfo', data);
           this.$router.replace('/home');
       })
   },
   resetForm() {
       this.$refs.loginForm.resetFields();
   }
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: rgb(22, 75, 119);

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .admin-logo {
      width: 130px;
      height: 130px;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .rule-form {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 0 20px;

        .btn {
            display: flex;
            justify-content:flex-end;
        }
    }
  }
}
</style>