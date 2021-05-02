<template>
  <div class="reports">
    <el-dialog
      :title="fromEdit ? '编辑用户' : '添加用户'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="userMsg"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="fromEdit" v-model="userMsg.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!fromEdit">
          <el-input v-model="userMsg.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userMsg.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userMsg.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateUserClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkMobile } from "utils/checkRule"
import { reqAddUsers, reqEditUser } from 'http/api'
export default {
  props: ["userObj"],
  data() {
    return {
      dialogVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      userMsg: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    };
  },
  methods: {
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    updateUserClick() {
      this.$refs.ruleForm.validate(async flag => {
        if(!flag) return;
        if(this.fromEdit) {
          const { email, mobile } = this.userMsg;
          const { meta } = await reqEditUser(this.userObj.id, email, mobile);
          if(meta.status != 200) return this.$message.error(meta.msg);
          this.$message.success(meta.msg);
        }else {
          const { meta } = await reqAddUsers(this.userMsg);
          if(meta.status != 201) return this.$message.error(meta.msg);
          this.$message.success("添加成功");
        }
        this.$emit('changeUserList');
        this.dialogVisible = false;
      });
    },
  },
  computed: {
    fromEdit() {
      const { id, username } = this.userObj;
      return !!(id || username);
    },
  },
  watch: {
    userObj(newVal) {
      if(!this.fromEdit) return this.userMsg = {};
      this.userMsg = newVal;
    }
  }
};
</script>

<style lang="less" scoped>
</style>