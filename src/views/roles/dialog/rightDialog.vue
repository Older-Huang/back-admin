<template>
  <div class="right-dialog">
    <el-dialog
      title="分配权限"
      :visible.sync="showRightsDialog"
      width="50%"
      @close="handleClose"
    >
     <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="currRoleRights"
        :props="defaultProps"
        default-expand-all 
        ref="tree"
     >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqRoledAuth } from "http/api"
export default {
    props: ["rightsList", "currRoleRights", "roleId"],
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        showRightsDialog: false
      };
    },
    methods: {
        handleClose() {
            this.showRightsDialog = false;
        },
        async updateRights() {
            const rids = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()].join(',');
            const { meta } = await reqRoledAuth(this.roleId, rids);
            if(meta.status != 200) return this.$message.error(meta.msg);
            this.$message.success(meta.msg);
            this.$emit("change");
            this.showRightsDialog = false;
        }
    }
};
</script>

<style lang="less" scoped>

</style>