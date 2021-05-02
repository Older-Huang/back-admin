<template>
  <div class="params-table">
    <el-button
     type="primary" 
     size="mini" 
     :disabled="!hasAttrs" 
     class="attr-btn"
     @click="editAttr(null, 'add')"
    >添加参数</el-button>
    <el-table
      ref="attrTable"
      :data="staticAttrList"
      highlight-current-row
      style="width: 100%"
      border
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-tag
            :key="index"
            v-for="(tag, index) in (row.attr_vals ? row.attr_vals.split(' ') : [])"
            closable
            :disable-transitions="false"
            @close="handleClose(tag, row)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="row.store"
            :ref="row.attr_id + ''"
            size="small"
            @keyup.enter.native="handleInputConfirm(row)"
            @blur="handleInputConfirm(row)"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput(row.attr_id + '')"
            >+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column property="attr_name" label="属性名称"> </el-table-column>
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
    <static-attr-dialog
     ref="attrDialog" 
     :attr="attr"
     @changeAttrName="changeAttrName"
     @addAttr="addAttr"
    />
  </div>
</template>

<script>
import { reqEditAttr, reqAddAttribute, reqDeleteAttr } from "http/api"
import StaticAttrDialog from './staticAttrDialog.vue';
export default {
  components: { StaticAttrDialog },
  props: ["attrList", "hasAttrs", "type"],
  data() {
      return {
          staticAttrList: [],
          inputVisible: false,
          attr: '',
          currAttrId: null
      }
  },
  methods: {
      editAttr(info, type) {
          if(type == 'add') {
              this.attr = new String('').toString()
          } else {
              this.currAttrId = info.attr_id;
              this.attr = new String(info.attr_name).toString();
          }
          this.$refs.attrDialog.dialogVisible = true;
      },
      deleteAttr(row) {
        this.$confirm("该操作将删除该属性，是否继续？", '提示', {
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
      handleInputConfirm(row) {
        let inputValue = row.store;
        if (inputValue) {
          const tagArr = row.attr_vals.split(" ");
          tagArr.push(inputValue);
          row.attr_vals = tagArr.join(" ").trim();
          this.updateAttr(row);
        }
        this.inputVisible = false;
        row.store = '';
      },
      showInput(dom) {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs[dom].$refs.input.focus();
        });
      },
      handleClose(tag, row) {
        this.$confirm("该操作将删除该参数，是否继续？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async (res) => {
            if (res == "confirm") {
              const tagArr = row.attr_vals.split(" ");
              tagArr.splice(tagArr.indexOf(tag), 1);
              row.attr_vals = tagArr.join(" ");
              this.updateAttr(row);
            }
          },
          (err) => {}
        );
      },
      async updateAttr(info) {
          const { cat_id, attr_id, attr_name, attr_sel, attr_vals } = info;
          const { meta } = await reqEditAttr(cat_id, attr_id, {attr_name, attr_sel, attr_vals});
           if (meta.status != 200) return this.$message.error(meta.msg);
          this.$message.success(meta.msg);
      },
      async changeAttrName(newVal) {
          const { cat_id, attr_sel } = this.attrList[0];
          const { meta } = await reqEditAttr(cat_id, this.currAttrId, {attr_name: newVal, attr_sel});
          if (meta.status != 200) return this.$message.error(meta.msg);
          this.$message.success(meta.msg);
          this.$emit('changeAttrList');
      },
      async addAttr(newVal){
          const { cat_id, attr_sel } = this.attrList[0];
          const { meta } = await reqAddAttribute(cat_id, {attr_name: newVal, attr_sel});
          if (meta.status != 201) return this.$message.error(meta.msg);
          this.$message.success(meta.msg);
          this.$emit('changeAttrList');
      }
  },
  computed: {
      isStatic() {
          return !!(this.type == "static");
      }
  },
  watch: {
      attrList(newVal) {
          if(this.isStatic) {
              this.staticAttrList = newVal
          }
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