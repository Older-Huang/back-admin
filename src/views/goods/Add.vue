<template>
  <div class="add">
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-steps :active="+activeValue - 1" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-tabs
      tab-position="left"
      style="height: 200px"
      v-model="activeValue"
      :before-leave="changeTab"
    >
      <el-tab-pane label="基本信息" name="1">
        <el-form
          :model="goodsInfo"
          label-position="top"
          label-width="80px"
          :rules="rules"
          ref="goodsForm"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsInfo.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodsInfo.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodsInfo.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodsInfo.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="goodsInfo.goods_cat"
              :options="categoriesList"
              label="cat_name"
              value="cat_id"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="2">
        <el-row>
          <el-col> 版式 </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-checkbox-group v-model="checkboxGroup">
              <el-checkbox
                checked
                :label="item"
                border
                :value="item.attr_id"
                v-for="(item, index) in categoriesAttrList"
                :key="item"
                @change="updateCateAttr(index)"
              ></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="3">
        <template v-for="item in attrs">
          <el-row :key="item.attr_id">
            <el-col class="attr-name">
              {{ item.attr_name }}
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-input v-model="item.attr_vals"></el-input>
            </el-col>
          </el-row>
        </template>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="4">
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          list-type="picture"
          :on-remove="onRemove"
          show-file-list
          :on-success="onSuccess"
          :on-error="onError"
          :headers="headerAuth"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="5">
        <div class="edit"></div>
        <el-button type="primary" class="add-btn" @click="addProduct">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      @close="dialogVisible = false"
    >
      <el-image
        :src="imgUrl"
        fit="contain"
      >
       <div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
       </div>
       <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
       </div>
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
import { reqCategoriesList, reqCategoriesAttrList, reqAddGoods } from "http/api";
import E from "wangeditor";
export default {
  data() {
    return {
      activeValue: "1",
      rules: {
        goods_name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      goodsInfo: {
        goods_name: "",
        goods_cat: [],
        goods_price: "",
        goods_number: null,
        goods_weight: "",
      },
      categoriesList: [],
      checkboxGroup: [],
      categoriesAttrList: [],
      attrs: [],
      headerAuth: {},
      pics: [],
      dialogVisible: false,
      imgUrl: '',
      goods_introduce: ''
    };
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
    changeTab() {
      let flag = true;
      this.$refs.goodsForm.validate(async (valid) => {
        if (!valid && typeof(this.goodsInfo.goods_cat) != "string") {
          flag = false;
          this.$message.error("请选择商品分类");
          return;
        }
        const id = this.goodsInfo.goods_cat[
          this.goodsInfo.goods_cat.length - 1
        ];
        if (this.activeValue == "1") {
          const { data } = await reqCategoriesAttrList(id, { sel: "many" });
          data.length > 0 &&
            (this.categoriesAttrList = data[0].attr_vals.split(" "));
        } else if (this.activeValue == "2") {
          const { data } = await reqCategoriesAttrList(id, { sel: "only" });
          data.length > 0 && (this.attrs = data);
        }
      });
      return flag;
    },
    updateCateAttr(index) {
      this.categoriesAttrList.splice(index, 1);
    },
    handlePreview(file) {
      const { response } = file;
      this.imgUrl = response.data.url;
      this.dialogVisible = true;
    },
    onRemove(file, fileList) {
      this.pics = [];
      fileList.forEach(item => {
        this.pics.push(item.response.data.tmp_path);
      });
    },
    onSuccess(res, file, fileList) {
      const { meta, data } = res;
      if (meta.status != 200) return this.$message.error("图片上传失败");
      this.$message.success("图片上传成功");
      this.pics = [];
      fileList.forEach(item => {
        this.pics.push(item.response.data.tmp_path);
      });
    },
    onError() {
      this.$message.error("上传图片失败");
    },
    beforeUpload() {
      this.headerAuth.Authorization = sessionStorage.getItem("token");
    },
    async addProduct() {
      if(typeof(this.goodsInfo.goods_cat) == "string") return this.$message.error("请选择商品分类");
      this.goodsInfo.goods_cat = this.goodsInfo.goods_cat.join(',');
      this.attrs = this.transformAttrs(this.attrs);
      const info = {...this.goodsInfo, goods_introduce: this.goods_introduce, pics: this.pics, attrs: this.attrs};
      const { meta } = await reqAddGoods(info);
      if(meta.status != 201) return this.$message.error(meta.msg);
      this.$message.success(meta.msg);
      this.$router.replace('/goods');
    },
    transformAttrs(arr) {
      let newArr = [];
      arr.forEach(item => {
        const { attr_id, attr_vals } = item;
        newArr.push({attr_id, attr_vals});
      });
      return newArr
    }
  },
  created() {
    this.getCategoriesList();
  },
  mounted() {
    const editor = new E(".edit");
    editor.config.onchange = () => {
        this.goods_introduce = editor.txt.text();
    }
    editor.create();
  },
};
</script>

<style lang="less" scoped>
.add {
  .el-steps {
    margin: 15px 0;
  }
  .el-tabs {
    height: auto !important;
  }
  .el-row {
    margin: 20px 0;
    font-size: 14px;
  }
  .el-checkbox {
    margin: 3px 20px 2px 0;
  }
  .attr-name {
    font-size: 14px;
    color: #606266;
  }
  .add-btn {
    margin-top: 15px;
  }
}
</style>