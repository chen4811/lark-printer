<template>
  <el-dialog
    :model-value="visible"
    @close="$emit('update:visible', false)"
    title="打印设置"
    width="500px"
    class="print-settings-dialog"
  >
    <el-form :model="localSettings" label-width="120px">
      <el-form-item label="打印方向">
        <el-radio-group v-model="localSettings.orientation" class="custom-radio-group">
          <el-radio label="portrait">纵向</el-radio>
          <el-radio label="landscape">横向</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider content-position="center">页边距设置</el-divider>
      <el-form-item label="上边距">
        <el-input-number
          v-model="localSettings.marginTop"
          :min="0"
          label="上边距"
          size="default"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="下边距">
        <el-input-number
          v-model="localSettings.marginBottom"
          :min="0"
          label="下边距"
          size="default"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="左边距">
        <el-input-number
          v-model="localSettings.marginLeft"
          :min="0"
          label="左边距"
          size="default"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="右边距">
        <el-input-number
          v-model="localSettings.marginRight"
          :min="0"
          label="右边距"
          size="default"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:visible", "update:settings"],
  data() {
    return {
      localSettings: { ...this.settings },
    };
  },
  watch: {
    settings: {
      deep: true,
      handler(newSettings) {
        this.localSettings = { ...newSettings };
      },
    },
  },
  methods: {
    handleSave() {
      this.$emit("update:settings", { ...this.localSettings });
      this.$emit("update:visible", false);
    },
    handleCancel() {
      this.localSettings = { ...this.settings };
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped>
.print-settings-dialog :deep(.el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.print-settings-dialog :deep(.el-dialog__title) {
  font-weight: bold;
  color: #303133;
}

.print-settings-dialog :deep(.el-dialog__body) {
  padding: 20px 25px;
}

.custom-radio-group {
  margin-top: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
}

.el-divider {
  margin: 15px 0;
}

.el-form-item {
  margin-bottom: 18px;
}
</style>
