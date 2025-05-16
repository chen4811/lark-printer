<template>
  <el-card class="field-card" shadow="hover">
    <template #header>
      <div class="field-header">{{ displayField.name }}</div>
    </template>
    <el-button @click="handleInsert" type="primary" size="small" class="insert-button">
      <el-icon><Plus /></el-icon>
      <span>添加</span>
    </el-button>
  </el-card>
</template>

<script>
import { Plus } from "@element-plus/icons-vue";

export default {
  name: "FieldCard",
  components: {
    Plus,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    subfield: {
      type: Object,
      default: null,
    },
    insertVariable: {
      type: Function,
      required: true,
    },
  },
  computed: {
    // 根據有無 subfield 決定要顯示的對象
    displayField() {
      return this.subfield || this.field;
    },
  },
  methods: {
    handleInsert() {
      // 根據有無 subfield 決定呼叫邏輯
      if (this.subfield) {
        this.insertVariable(this.subfield, this.field, true);
      } else {
        this.insertVariable(this.field);
      }
    },
  },
};
</script>

<style scoped>
.field-card {
  margin-bottom: 8px;
  border-radius: 6px;
  transition: all 0.3s;
}

.field-card:hover {
  transform: translateY(-2px);
}

.field-header {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.insert-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.el-card :deep(.el-card__header) {
  padding: 10px 15px;
  background-color: #f5f7fa;
}

.el-card :deep(.el-card__body) {
  padding: 10px;
}
</style>
