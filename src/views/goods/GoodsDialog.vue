<template>
  <div class="right-dialog">
    <el-dialog
      title="编辑商品"
      :visible.sync="showDialog"
      width="50%"
      @close="handleClose"
    >
     <el-form
        :model="productInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="productInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="productInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="productInfo.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="productInfo.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="goods_introduce">
          <el-input v-model="productInfo.goods_introduce"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqEditProduct } from "http/api"
export default {
    props: ["productObj"],
    data() {
      return {
        showDialog: false,
        productInfo: {
            goods_name: '',
            goods_price: '',
            goods_number: '',
            goods_weight: '',
            goods_introduce: ''
        },
        rules: {
            goods_name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            goods_price: [
                { required: true, message: '请输入商品价格', trigger: 'blur' }
            ],
            goods_number: [
                { required: true, message: '请输入商品数量', trigger: 'blur' }
            ],
            goods_weight: [
                { required: true, message: '请输入商品重量', trigger: 'blur' }
            ]
        }
      };
    },
    methods: {
        handleClose() {
            this.$refs.ruleForm.resetFields();
            this.showDialog = false;
        },
        submitProduct() {
            this.$refs.ruleForm.validate(async flag => {
                if(!flag) return;
                const res = await reqEditProduct(this.productObj.id, this.productInfo);
                console.log(res);
            })
        }
    },
    watch: {
        productObj(newVal) {
            const { 
                goods_name,
                goods_price,
                goods_number,
                goods_weight,
                goods_introduce
            } = newVal;
            this.productInfo = { 
                goods_name,
                goods_price,
                goods_number,
                goods_weight,
                goods_introduce
            }
        }
    }
};
</script>

<style lang="less" scoped>

</style>