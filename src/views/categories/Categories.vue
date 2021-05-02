<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/categories' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <el-button @click="addCategories" type="primary" class="add-btn"
            >添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="序号"
        border
        :show-row-hover="false"
      >
        <template #effective="{ row }">
          <i
            :class="!row.cate_deleted ? 'el-icon-success' : 'el-icon-error'"
          ></i>
        </template>
        <template #sort="{ row }">
          <el-tag size="mini" v-if="row.cat_level == 0"> 一级 </el-tag>
          <el-tag type="success" size="mini" v-else-if="row.cat_level == 1">
            二级
          </el-tag>
          <el-tag type="warning" size="mini" v-else> 三级 </el-tag>
        </template>
        <template #operation="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCategories(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCurrCate(row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="categoriesInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="categoriesInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form
        :model="addCategoriesInfo"
        :rules="rules"
        ref="categoriesForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoriesInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类级别">
          <el-cascader
            v-model="addCategoriesInfo.cat_pid"
            :options="options"
            :props="{ expandTrigger: 'hover', checkStrictly: true }"
            style="width: 100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addCategoriesClick">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditClose">
      <el-form
        :model="editCategoriesInfo"
        :rules="rules"
        ref="editCateForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoriesInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditClose">取 消</el-button>
        <el-button type="primary" @click="updateCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqCategoriesList,
  reqAddCategories,
  reqDeleteCategories,
  reqEditCategories
} from "http/api";

export default {
  data() {
    return {
      categoriesList: [],
      categoriesInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      totalPage: 1,
      defaultProps: {
        children: "children",
        label: "cat_name",
      },
      dialogVisible: false,
      rules: {
        cat_name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      addCategoriesInfo: {
        cat_pid: [],
        cat_name: "",
        cat_level: 1,
      },
      options: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "effective",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      editDialogVisible: false,
      editCategoriesInfo: {
        cat_name: '',
        id: null
      }
    };
  },
  methods: {
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
    // 添加分类
    async addCategories() {
      const { data } = await reqCategoriesList({ type: 2 });
      this.options = this.transformDataList(data);
      this.dialogVisible = true;
    },
    // 分类编辑
    editCategories(row) {
      let { cat_id: id, cat_name } = row;
      this.editCategoriesInfo = { id, cat_name};
      this.editDialogVisible = true;
    },
    // 分类删除
    deleteCurrCate(id) {
      this.categoriesInfo.pagenum = 1;
      this.$confirm("该操作将删除该分类，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        async (res) => {
          if (res == "confirm") {
            const { meta } = await reqDeleteCategories(id);
            if (meta.status != 200) return this.$message.error(meta.msg);
            this.$message.success(meta.msg);
            this.getCategoriesList();
          }
        },
        (err) => {}
      );
    },
    // 换最大条数
    handleSizeChange(size) {
      this.categoriesInfo.pagesize = size;
      this.getCategoriesList();
    },
    // 换页码
    handleCurrentChange(currNum) {
      this.categoriesInfo.pagenum = currNum;
      this.getCategoriesList();
    },
    // 请求分类列表
    async getCategoriesList() {
      const { data } = await reqCategoriesList(this.categoriesInfo);
      this.totalPage = data.total;
      this.categoriesList = data.result;
    },
    handleClose() {
      this.$refs.categoriesForm.resetFields();
      this.dialogVisible = false;
    },
    addCategoriesClick() {
      this.$refs.categoriesForm.validate(async (flag) => {
        if (!flag) return;
        let { cat_pid } = this.addCategoriesInfo;
        this.addCategoriesInfo.cat_pid =
          cat_pid.length == 0 ? 0 : cat_pid[cat_pid.length - 1];
        this.addCategoriesInfo.cat_level =
          cat_pid.length == 0 ? 0 : cat_pid.length;
        const { meta } = await reqAddCategories(this.addCategoriesInfo);
        if (meta.status != 201) return this.$message.error(meta.msg);
        this.$message.success(meta.msg);
        this.getCategoriesList();
        this.dialogVisible = false;
      });
    },
    handleEditClose() {
      this.$refs.editCateForm.resetFields();
      this.editDialogVisible = false;
    },
    updateCategories() {
      this.$refs.editCateForm.validate(async (flag) => {
        if (!flag) return;
        const { id, cat_name } = this.editCategoriesInfo;
        const { meta } = await reqEditCategories(id, {cat_name});
        if (meta.status != 200) return this.$message.error(meta.msg);
        this.$message.success(meta.msg);
        this.getCategoriesList();
        this.editDialogVisible = false;
      });
    }
  },
  created() {
    this.getCategoriesList();
  },
};
</script>

<style lang="less" scoped>
.categories {
  .el-table {
    margin: 15px 0;
    font-size: 12px;
  }
  .el-icon-success {
    color: #67c23a;
  }
  .el-icon-error {
    color: #f56c6c;
  }
  .add-btn {
    margin-bottom: 15px;
  }
}
</style>