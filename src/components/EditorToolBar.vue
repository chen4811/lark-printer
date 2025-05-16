<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="编辑模式">
        <el-switch
          v-model="isEdited"
          active-text="开启"
          inactive-text="关闭"
          @change="toggleEditorMode"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="openPrintSettings">打印设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "EditorToolBar",
  props: {
    toggleEditorMode: Function,
    isOpenDrawer: Boolean,
  },
  emits: [
    "update:isEdited",
    "update:isPrintSettingsVisible",
  ],
  data() {
    return {
      isEdited: this.isEdited, // 初始化时使用 props 传递的值
      isPrintSettingsVisible: false,
    };
  },
  watch: {
    // 当 isEdited 或 isOpenDrawer 改变时，通知父组件更新
    isEdited(newValue) {
      this.$emit("update:isEdited", newValue);
    },
    
  },
  methods: {
    toggleDrawer() {
      this.$emit("update:isOpenDrawer", true);
    },
    openPrintSettings() {
      this.$emit("update:isPrintSettingsVisible", true);
    },
  },
};
</script>
<style scoped>
.el-form-item {
  margin-bottom: 0;
  margin-right: 10px;
}
</style>