<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row class="search-input">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="usersParams.query"
            class="input-with-select"
          >
            <el-button
              @click="searchClick"
              slot="append"
              icon="el-icon-search"
              :disabled="usersParams.query.length == 0"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addUser" type="primary" class="add-btn"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table border style="width: 100%" :data="userList">
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="role_name" label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.mg_state"
              @change="changeUserState(row.id, row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="操作"  width="180">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCurrUser(row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="distriRoleClick(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersParams.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="usersParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      >
      </el-pagination>
    </el-card>
    <dialog-el
      ref="dialog"
      :userObj="userObj"
      @changeUserList="changeUserList"
    />
    <role-dialog ref="role" @changeUserList="changeUserList" :role-info="roleInfo" :role-list="roleList" />
  </div>
</template>

<script>
import { reqUserDataList, reqUpdateUserState, reqDeleteUser, reqRoleList } from "http/api";
import DialogEl from "./dialog/dialogEl.vue";
import RoleDialog from './dialog/roleDialog.vue';
export default {
  data() {
    return {
      usersParams: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      totalPage: 1,
      userList: [],
      userObj: {},
      roleInfo: {},
      roleList: []
    };
  },
  components: {
    DialogEl, RoleDialog
  },
  methods: {
    async getUserDataList() {
      const { data } = await reqUserDataList(this.usersParams);
      this.totalPage = data.total;
      this.userList = data.users;
    },
    handleSizeChange(val) {
      this.usersParams.pagesize = val;
      this.getUserDataList();
    },
    handleCurrentChange(val) {
      this.usersParams.pagenum = val;
      this.getUserDataList();
    },
    searchClick() {
      this.usersParams.pagenum = 1;
      this.getUserDataList();
    },
    addUser() {
      this.userObj = {};
      this.$refs.dialog.dialogVisible = true;
    },
    editUser(content) {
      const { id, mobile, username, email } = content;
      this.userObj = { id, mobile, username, email };
      this.$refs.dialog.dialogVisible = true;
    },
    changeUserList() {
      this.getUserDataList();
    },
    async changeUserState(id, state) {
      const { meta } = await reqUpdateUserState(id, state);
      if (meta.status != 200) return this.$message.error(meta.msg);
      this.$message.success(meta.msg);
    },
    deleteCurrUser(id) {
      this.$confirm("该操作将删除该用户，是否继续？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
        async (res) => {
          if (res == "confirm") {
            const { meta } = await reqDeleteUser(id);
            if (meta.status != 200) return this.$message.error(meta.msg);
            this.$message.success(meta.msg);
            this.getUserDataList();
          }
        },
        (err) => {}
      );
    },
    distriRoleClick(info) {
      this.roleInfo = info;
      this.$refs.role.showRoleDialog = true;
    },
    async getRoleList() {
      const { data } = await reqRoleList();
      this.roleList = data
    }
  },
  created() {
    this.getUserDataList();
    this.getRoleList();
  },
};
</script>

<style lang="less" scoped>
.users {
  .add-btn {
    margin-left: 20px;
  }
  .el-table {
    margin: 15px 0;
    font-size: 13px;
  }
}
</style>