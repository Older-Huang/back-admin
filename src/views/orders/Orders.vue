<template>
  <div class="orders">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/orders' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        border=""
        style="width: 100%"
      >
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column property="ordername" label="订单名称">
        </el-table-column>
        <el-table-column label="操作">
          <template #default>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  }
};
</script>

<style lang="less" scoped>
</style>