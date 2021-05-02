<template>
  <div class="reports">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/reports' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="main" ref="main">

      </div>
    </el-card>
  </div>
</template>

<script>
import { reqReports } from "http/api"
import * as echarts from "echarts"
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {
    async getReports() {
      const { data } = await reqReports();
      Object.assign(this.options, data);
    }
  },
  created() {
    this.getReports();
  },
  mounted() {
    let chartDom = this.$refs.main;
    let myChart = echarts.init(chartDom);
    myChart.setOption(this.options);
  }
};
</script>

<style lang="less" scoped>
.reports {
  .main {
    width: 600px;
    height: 400px;
  }
}
</style>