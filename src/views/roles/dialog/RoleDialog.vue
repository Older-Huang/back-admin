<template>
  <div class="el-dialog">
      <el-dialog
      :title="fromEdit ? '编辑角色' : '添加角色'"
      :visible.sync="showRoleDialog"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="roleInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqEditRole, reqAddRole } from "http/api"
export default {
    props: ["roleObj"],
    data() {
        return {
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                ]
            },
            roleInfo: {
                roleName: '',
                roleDesc: ''
            },
            showRoleDialog: false
        }
    },
    methods: {
        handleClose() {
            this.$refs.ruleForm.resetFields();
            this.showRoleDialog = false;
        },
        updateRole() {
          this.$refs.ruleForm.validate(async flag => {
            if(!flag) return;
            if(this.fromEdit) {
              const { meta } = await reqEditRole(this.roleObj);
              if(meta.status != 200) return this.$message.error(meta.msg);
              this.$message.success(meta.msg);
            }else {
              const { roleName, roleDesc } = this.roleInfo;
              const { meta } = await reqAddRole({roleName, roleDesc});
              if(meta.status != 201) return this.$message.error(meta.msg);
              this.$message.success(meta.msg);
            }
            this.$emit("updateRoleList");
            this.showRoleDialog = false;
          })
          
        }
    },
    computed: {
      fromEdit() {
        const { id, roleName } = this.roleObj;
        return !!(id || roleName);
      }
    },
    watch: {
      roleObj(newInfo) {
        if(this.fromEdit) {
          this.roleInfo = newInfo;
        }else {
          this.roleInfo = {};
        }
      }
    }
}
</script>

<style lang="less" scoped>

</style>