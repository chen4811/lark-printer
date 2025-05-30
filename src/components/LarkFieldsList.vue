<template>
  <div class="fixed-field-container">
    <div
      v-for="field in fieldsList"
      :key="field.id"
      style="margin-bottom: 5px"
    >
      <template v-if="field.type != 18 && field.type != 21">
        <FieldCard
          class="first-level"
          :field="field"
          :insertVariable="insertVariable"
        ></FieldCard>
      </template>
      <template v-else>
        <FieldCollapse
          :field="field"
          :insertVariable="insertVariable"
          :end="false"
        ></FieldCollapse>
      </template>
    </div>
</div>
</template>

<script>
import { bitable } from "@lark-base-open/js-sdk";
import FieldCollapse from "./FieldCollapse.vue";
import FieldCard from "./FieldCard.vue";

export default {
  name: "LarkFieldsList",
  data() {
    return {
      isOpenDrawer: false,
      tableId: "",
      fieldsList: [],
    };
  },
  props: {
    editorInstance: Object,
    isOpen: Boolean,
  },
  async mounted() {
    const table = await bitable.base.getActiveTable();
    const fieldList = await table.getFieldMetaList();
    this.tableId = table.id;
    this.fieldsList = fieldList;
    this.isOpenDrawer = this.isOpen;
  },
  methods: {
    // 移除抽屉切换方法
    async getTableFieldMetaList(tableId) {
      const table = await bitable.base.getTableById(tableId);
      const fields = await table.getFieldMetaList();
      return fields;
    },
    insertVariable(field, father = null, isLink = false) {
      let father_fieldId = "";
      let tableId = "";
      let fieldName = field.name;

      if (isLink) {
        father_fieldId = father.id;
        fieldName = `${father.name}.${field.name}`;
        tableId = father.property.tableId;
      } else {
        father_fieldId = "*";
        tableId = this.tableId;
      }

      this.editorInstance.insertContent(`
          <div class="template-field" contenteditable="false"
              data-tableid="${tableId}"
              data-fieldid="${field.id}"
              data-fieldname="${fieldName}"
              data-fieldtype="${field.type}"
              data-father-field="${father_fieldId}">
             {{${fieldName}}}
          </div>`);
    },
    toggleDrawer() {
      this.$emit("update:isOpen", !this.isOpen);
    },
  },
  components: { FieldCard, FieldCollapse },
};
</script>

<style scoped>
.template-field {
  max-width: fit-content !important;
}

.fixed-field-container {
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  width: 180px;
}

.fixed-field-container::-webkit-scrollbar {
  width: 6px;
}

.fixed-field-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.fixed-field-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.fixed-field-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
