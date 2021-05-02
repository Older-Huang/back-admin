<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button @click="addRole" type="primary" class="add-btn">
        添加角色
      </el-button>
      <el-table :data="roleList" style="width: 100%" border>
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-row v-for="(fItem, index) in row.children" :key="fItem.id" class="b-border" :class="{'t-border': index == 0}">
              <el-col :span="5">
                <el-tag
                  closable
                  @close="handleClose(row, fItem.id)">
                  {{ fItem.authName }}
                </el-tag>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(sItem, sIndex) in fItem.children" :key="sItem.id" class="t-border" :class="{'t-nonebor': sIndex == 0}">
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="handleClose(row, sItem.id)">
                      {{ sItem.authName }}
                    </el-tag>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      v-for="tItem in sItem.children"
                      :key="tItem.id"
                      closable
                      @close="handleClose(row, tItem.id)">
                      {{ tItem.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="290">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="distriRights(row)"
            >分配权限</el-button>
          </template>  
        </el-table-column>
      </el-table>
      <role-dialog ref="role" :role-obj="roleInfo" @updateRoleList="changeRoleList" />
    </el-card>
    <right-dialog
     ref="rightDialog" 
     :role-id="roleId" 
     :rights-list="rightsList" 
     :curr-role-rights="currRoleRights"
     @change="changeRoleList"
    />
  </div>
</template>

<script>
import { reqRoleList, reqDeleteRole, reqDeleteRoleRights, reqRightsList } from "http/api"
import roleDialog from './dialog/RoleDialog'
import RightDialog from './dialog/rightDialog.vue';
export default {
  components: { roleDialog, RightDialog },
  data() {
    return {
        roleList: [],
        roleInfo: {},
        rightsList: [],
        currRoleRights: [],
        roleId: null
    }
  },
  methods: {
    addRole() {
      this.roleInfo = {};
      this.$refs.role.showRoleDialog = true;
    },
    async getRoleList() {
      const { data } = await reqRoleList();
      this.roleList = data;
    },
    editRole(info) {
      const { id, roleDesc, roleName } = info;
      this.roleInfo = { id, roleDesc, roleName };
      this.$refs.role.showRoleDialog = true;
    },
    changeRoleList() {
      this.getRoleList();
    },
    deleteRole(id) {
       this.$confirm("该操作将删除该角色，是否继续？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
        async (res) => {
          if (res == "confirm") {
            const { meta } = await reqDeleteRole(id);
            if (meta.status != 200) return this.$message.error(meta.msg);
            this.$message.success(meta.msg);
            this.getRoleList();
          }
        },
        (err) => {}
      );
    },
    handleClose(info, rId) {
      this.$confirm("该操作将删除该角色权限，是否继续？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
        async (res) => {
          if (res == "confirm") {
            const { meta, data } = await reqDeleteRoleRights(info.id, rId);
            if (meta.status != 200) return this.$message.error(meta.msg);
            this.$message.success(meta.msg);
            info.children = data;
          }
        },
        (err) => {
          this.$message("您取消了该操作");
        }
      );
    },
    async distriRights(row) {
      this.roleId = row.id;
      this.currRoleRights = [];
      this.getRoleRightsIdList(row);
      const { data } = await reqRightsList("tree");
      this.rightsList = data;
      this.$refs.rightDialog.showRightsDialog = true;
    },
    getRoleRightsIdList(obj) {
      if(!obj.children) return this.currRoleRights.push(obj.id);
      obj.children.forEach(item => {
        this.getRoleRightsIdList(item);
      });
    }
  },
  created() {
    this.getRoleList();
  }
};
</script>

<style lang="less" scoped>
.roles {
  .add-btn {
    margin-bottom: 15px;
  }
  .el-row {
    display: flex;
    align-items: center;

    .el-tag {
      margin: 10px;
    }
  }
  
}
.t-border {
  border-top: 1px solid #ddd;
}
.b-border {
  border-bottom: 1px solid #ddd;
}
.t-nonebor {
  border-top: none;
}
</style>