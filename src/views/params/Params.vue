<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/params' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <el-row>
        <el-col>
          选择商品分类：
            <el-cascader
              v-model="attrs"
              :options="categoriesList"
              label="cat_name"
              value="cat_id"
              :props="{ expandTrigger: 'hover' }"
              @change="getCurrAttrList"
            ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="dynamic">
          <params-tab :attrList="categoriesAttrList" @changeAttrList="getCurrAttrList" />
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="static">
          <static-attr-tab
           :type="activeName" 
           :attrList="categoriesAttrList" 
           :hasAttrs="attrs.length != 0" 
           @changeAttrList="getCurrAttrList"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { reqCategoriesList, reqCategoriesAttrList } from "http/api"
import paramsTab from './paramsTab.vue';
import StaticAttrTab from './staticAttrTab.vue';
export default {
  components: { paramsTab, StaticAttrTab },
  data() {
    return {
      activeName: 'dynamic',
      categoriesList: [],
      value: '',
      attrs: [],
      categoriesAttrList: [],
    }
  },
  methods: {
    async getCategoriesList() {
      const { data } = await reqCategoriesList({ type: [1, 2, 3] });
      this.categoriesList = this.transformDataList(data);
    },
    transformDataList(data) {
      let arr = [];
      data.forEach((item) => {
        let { cat_id: value, cat_name: label, children } = item;
        if (children) {
          children = this.transformDataList(children);
          arr.push({ value, label, children });
        } else {
          arr.push({ value, label });
        }
      });
      return arr;
    },
    handleClick() {
      this.getCurrAttrList();
    },
    async getCurrAttrList() {
      if(this.attrs.length == 0) return;
      const id = this.attrs[this.attrs.length - 1];
      const sel = this.activeName == "dynamic" ? "many" : "only";
      const { data } = await reqCategoriesAttrList(id, {sel});
      this.categoriesAttrList = data;
    }
  },
  created() {
    this.getCategoriesList();
  }
};
</script>

<style lang="less" scoped>
.params {
  .el-row {
    margin: 15px 0;
  }
}
</style>