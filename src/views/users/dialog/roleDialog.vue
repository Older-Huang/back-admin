<template>
  <div class="role-dialog">
    <el-dialog
      title="分配角色"
      :visible.sync="showRoleDialog"
      width="50%"
      :before-close="handleClose"
    >
      <el-row>当前用户是：{{ roleInfo.username }} </el-row>
      <el-row>当前角色：{{ roleInfo.role_name }}</el-row>
      <el-row>
        分配角色：
        <el-select v-model="selectRole" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="changeRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqUserRole } from "http/api"
export default {
    props: ['roleInfo', 'roleList'],
  data() {
    return {
      showRoleDialog: false,
      selectRole: ''
    };
  },
  methods: {
    handleClose() {
      this.showRoleDialog = false;
    },
    async changeRole() {
        if(!this.selectRole) return;
        const { meta } = await reqUserRole(this.roleInfo.id, this.selectRole);
        if(meta.status != 200) return this.$message.error(meta.msg);
        this.$message.success(meta.msg);
        this.$emit("changeUserList");
        this.selectRole = '';
        this.showRoleDialog = false;
    }
  },
};
</script>

<style lang="less" scoped>
</style>