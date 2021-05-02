<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        ref="singleTable"
        :data="rightsList"
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column property="authName" label="权限名称">
        </el-table-column>
        <el-table-column property="path" label="路径">
        </el-table-column>
        <el-table-column property="level" label="权限等级">
          <template #default="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { reqRightsList } from "http/api";
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    async getRightsList() {
      const { data } = await reqRightsList("list");
      this.rightsList = data;
    },
  },
  created() {
    this.getRightsList();
  },
};
</script>

<style lang="less" scoped>
.rights {
  .el-table {
    font-size: 13px;
  }
}
</style>