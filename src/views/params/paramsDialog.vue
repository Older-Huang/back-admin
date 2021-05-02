<template>
  <div class="params-dialog">
    <el-dialog
      :title="fromEdit ? '编辑动态参数' : '添加动态参数'"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form 
       :model="paramsForm"
       label-position="right" 
       :rules="rules" ref="paramsForm" 
       class="demo-ruleForm"
       label-width="80px"
      >
        <el-form-item label="动态参数" prop="paramsName">
            <el-input v-model="paramsForm.paramsName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="changeParamsName"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["params"],
  data() {
    return {
      dialogVisible: false,
      paramsForm: {
          paramsName: ''
      },
      rules: {
          paramsName: [
              { required: true, message: '请输入参数名称', trigger: 'blur' }
          ]
      }
    };
  },
  methods: {
    handleClose() {
      this.$refs.paramsForm.resetFields();
      this.dialogVisible = false;
    },
    changeParamsName() {
      this.$refs.paramsForm.validate(async flag => {
        if(!flag) return;
        let handleFunc = this.fromEdit ? "changeParamsName" : 'addAttr';
        this.$emit(handleFunc, this.paramsForm.paramsName);
      })
      this.dialogVisible = false;
    },
  },
  watch: {
      params(newVal) {
          this.paramsForm.paramsName = this.fromEdit ? newVal : "";
      }
  },
  computed: {
    fromEdit() {
      return !!(this.params);
    }
  }
};
</script>

<style lang="less" scoped>
</style>