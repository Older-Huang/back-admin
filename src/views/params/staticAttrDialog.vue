<template>
  <div class="static-dialog">
    <el-dialog
      :title="fromEdit ? '编辑静态属性' : '添加动态属性'"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form
        :model="attrForm"
        label-position="right"
        :rules="rules"
        ref="attrForm"
        class="demo-ruleForm"
        label-width="80px"
      >
        <el-form-item label="静态属性" prop="attrName">
          <el-input v-model="attrForm.attrName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="changeAttrName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["attr"],
  data() {
    return {
      dialogVisible: false,
      attrForm: {
        attrName: "",
      },
      rules: {
        attrName: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.$refs.attrForm.resetFields();
      this.dialogVisible = false;
    },
    changeAttrName() {
      this.$refs.attrForm.validate(async (flag) => {
        if (!flag) return;
        let handleFunc = this.fromEdit ? "changeAttrName" : "addAttr";
        this.$emit(handleFunc, this.attrForm.attrName);
      });
      this.dialogVisible = false;
    },
  },
  watch: {
    attr(newVal) {
      this.attrForm.attrName = this.fromEdit ? newVal : "";
    },
  },
  computed: {
    fromEdit() {
      return !!(this.attr);
    },
  },
};
</script>

<style lang="less" scoped>
</style>