<template>
  <div class="params-table">
    <el-button
     type="primary" 
     size="mini" 
     :disabled="!showAdd" 
     class="attr-btn"
     @click="editAttr(null, 'add')"
    >添加参数</el-button>
    <el-table
      ref="attrTable"
      :data="attrList"
      highlight-current-row
      style="width: 100%"
      border
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag, row)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ New Tag</el-button
          >
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column property="attr_name" label="参数名称"> </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editAttr(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteAttr(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <params-dialog
     ref="paramsDialog" 
     :params="params" 
     @changeParamsName="changeAttrName"
     @addAttr="addAttr" 
    />
  </div>
</template>

<script>
import { reqEditAttr, reqDeleteAttr, reqAddAttribute } from "http/api"
import paramsDialog from './paramsDialog.vue';
export default {
  components: { paramsDialog },
  props: ["attrList"],
  data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        params: '',
        showAdd: false
      }
  },
  methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        this.updateDynamicAttr();
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
        this.updateDynamicAttr();
      },
      async updateDynamicAttr() {
        const { cat_id: id, attr_id, attr_name, attr_sel } = this.attrList[0];
        const attr_vals = this.dynamicTags.join(" ");
        const { meta, data } = await reqEditAttr(id, attr_id, {attr_name, attr_sel, attr_vals});
        if(meta.status != 200) return this.$message.error(meta.msg);
        this.dynamicTags = data.attr_vals.split(' ');
        this.$message.success(meta.msg);
      },
      deleteAttr(row) {
         this.$confirm("该操作将删除该参数，是否继续？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async (res) => {
            if (res == "confirm") {
              let { cat_id: id, attr_id: attrId} = row;
              const { meta, data } = await reqDeleteAttr(id, attrId);
              if (meta.status != 200) return this.$message.error(meta.msg);
              this.$message.success(meta.msg);
              this.$emit("changeAttrList");
            }
          },
          (err) => {}
        );
      },
      editAttr(row, type) {
        this.params = type == 'add' ? '' : new String(row.attr_name);
        this.$refs.paramsDialog.dialogVisible = true;
      },
      changeAttrName(newVal) {
        this.attrList[0].attr_name = newVal.toString();
        this.updateDynamicAttr();
      },
      async addAttr(newAttr) {
        const { cat_id, attr_sel } = this.attrList[0];
        const { meta } = await reqAddAttribute(cat_id, { attr_name: newAttr, attr_sel});
        if(meta.status != 201) return this.$message.error(meta.msg);
        this.$message.success(meta.msg);
        this.$emit("changeAttrList");
      }
  },
  watch: {
      attrList(newVal) {
          this.showAdd = true;
          if(!newVal[0] || newVal[0].attr_vals.length == 0) return this.dynamicTags = [];
          this.dynamicTags = newVal[0].attr_vals.split(" ");
      }
  }
};
</script>

<style lang="less" scoped>
.params-table {
  .attr-btn {
    margin-bottom: 15px;
  }
  .el-tag {
      margin-right: 10px;
      margin-top: 10px;
  }
}
</style>