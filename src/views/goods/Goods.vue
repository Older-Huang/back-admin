<template>
  <div class="goods">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/goods' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ showAdd ? '商品列表' : '添加商品' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <template v-if="showAdd">
        <el-row class="search-input">
          <el-col :span="10">
            <el-input
              placeholder="请输入内容"
              v-model="productInfo.query"
              class="input-with-select"
            >
              <el-button
                @click="searchClick"
                slot="append"
                icon="el-icon-search"
                :disabled="productInfo.query.length == 0"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button @click="addProduct" type="primary" class="add-btn"
              >添加商品</el-button
            >
          </el-col>
        </el-row>
        <el-table border style="width: 100%" :data="productList">
          <el-table-column type="index" width="50" label="#"> </el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格（元）" width="90">
          </el-table-column>
          <el-table-column prop="goods_weight" label="重量（kg）" width="70">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="140">
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editProduct(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteCurrProduct(row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="productInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="productInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        >
        </el-pagination>
      </template>
      <template v-else>
        <router-view />
      </template>
    </el-card>
    <goods-dialog ref="goodsDialog" :product-obj="productObj" />
  </div>
</template>

<script>
import { reqProductList, reqDeleteProduct } from "http/api";
import GoodsDialog from './GoodsDialog.vue';

export default {
  data() {
    return {
      productList: [],
      productInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      totalPage: 1,
      productObj: {},
    };
  },
  components: {GoodsDialog},
  methods: {
    // 点击搜索
    searchClick() {
      this.productInfo.pagenum = 1;
      this.getProductList();
    },
    // 添加商品
    addProduct() {
      this.$router.push("goods/add");
    },
    // 商品编辑
    editProduct(info) {
      const {
        goods_id: id,
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
      } = info;
      this.productObj = {
        id,
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
      };
      this.$refs.goodsDialog.showDialog = true;
    },
    // 商品删除
    deleteCurrProduct(id) {
      this.productInfo.pagenum = 1;
      this.$confirm("该操作将删除该商品，是否继续？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
        async (res) => {
          if (res == "confirm") {
            const { meta } = await reqDeleteProduct(id);
            if (meta.status != 200) return this.$message.error(meta.msg);
            this.$message.success(meta.msg);
            this.getProductList();
          }
        },
        (err) => {}
      );
    },
    // 换最大条数
    handleSizeChange(size) {
      this.productInfo.pagesize = size;
      this.getProductList();
    },
    // 换页码
    handleCurrentChange(currNum) {
      this.productInfo.pagenum = currNum;
      this.getProductList();
    },
    // 请求商品列表
    async getProductList() {
      const { data } = await reqProductList(this.productInfo);
      this.totalPage = data.total;
      this.productList = data.goods;
    },
  },
  computed: {
    showAdd() {
      return this.$route.path === "/goods";
    },
  },
  created() {
    this.getProductList();
  },
};
</script>

<style lang="less" scoped>
.goods {
  .add-btn {
    margin-left: 20px;
  }
  .el-table {
    margin: 15px 0;
    font-size: 12px;
  }
}
</style>