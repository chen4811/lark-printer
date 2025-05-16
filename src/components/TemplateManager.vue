<template>
  <div class="template-toolbar">
    <el-button-group>
      <el-select
        id="templateList"
        v-model="selectedTemplate"
        @change="onTemplateChange"
        class="select-box"
        placeholder="请选择模板"
      >
        <el-option value="" disabled>请选择模板</el-option>
        <el-option
          v-for="item in irentTemplates"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-button-group>
    <el-button-group>
      <el-button
        @click="saveTemplate"
        type="primary"
        :disabled="!isEdited && !selectedTemplate"
        class="action-button"
      >
        <el-icon>
          <Files></Files>
        </el-icon>
        <span>保存</span>
      </el-button>
      <el-button 
        @click="createTemplate" 
        type="success" 
        class="action-button"
      >
        <el-icon>
          <DocumentAdd />
        </el-icon>
        <span>添加</span>
      </el-button>
      <el-button
        @click="deleteTemplate"
        type="danger"
        :disabled="!selectedTemplate"
        class="action-button"
      >
        <el-icon>
          <Delete />
        </el-icon>
        <span>删除</span>
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
// 移除 axios 相关
import { applyTemplate } from "@/plugins/content";
import { Delete, DocumentAdd, Files } from "@element-plus/icons-vue";

export default {
  name: "TemplateManager",
  components: {
    Files,
    Delete,
    DocumentAdd,
  },
  props: {
    isEdited: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:content", "update:selectedTemplate"],
  data() {
    return {
      selectedTemplate: null,
      irentTemplates: [],
    };
  },
  mounted() {
    this.loadTemplates();
  },
  methods: {
    loadTemplates() {
      // 从localStorage加载模板列表
      const templates = JSON.parse(localStorage.getItem("irent_templates_list") || "[]");
      this.irentTemplates = templates;
      if (templates.length > 0 && !this.selectedTemplate) {
        this.selectedTemplate = templates[0].id;
      }
    },
    loadTemplateContent(templateId) {
      // 从localStorage加载模板内容
      const content = localStorage.getItem("irent_template_" + templateId) || "";
      this.$emit("update:content", content);
    },
    onTemplateChange() {
      this.$emit("update:selectedTemplate", this.selectedTemplate);
      this.loadTemplateContent(this.selectedTemplate);
    },
    saveTemplate() {
      let templateId = this.selectedTemplate;
      const content = this.$attrs.content;
      if (!templateId) {
        const templateName = prompt("请输入模板名称", "新模板");
        if (!templateName || !templateName.trim()) {
          alert("模板名称不能为空！");
          return;
        }
        templateId = uuidv4();
        this.irentTemplates.push({ name: templateName, id: templateId });
        localStorage.setItem("irent_templates_list", JSON.stringify(this.irentTemplates));
        this.selectedTemplate = templateId;
        this.$emit("update:content", content);
      }
      // 保存模板内容到localStorage
      localStorage.setItem("irent_template_" + templateId, content);
      alert("模板保存成功！");
      this.loadTemplates();
    },
    createTemplate() {
      const templateName = prompt("请输入想要保存的版面名称", "sample");
      if (!templateName || !templateName.trim()) {
        alert("模板名称不能为空！");
        return;
      }
      const templateId = uuidv4();
      this.irentTemplates.push({ name: templateName, id: templateId });
      localStorage.setItem("irent_templates_list", JSON.stringify(this.irentTemplates));
      localStorage.setItem("irent_template_" + templateId, "");
      this.selectedTemplate = templateId;
      this.$emit("update:content", "");
    },
    deleteTemplate() {
      const template = this.selectedTemplate;
      const templateIndex = this.irentTemplates.findIndex(
        (item) => item.id === template
      );
      if (templateIndex !== -1) {
        this.irentTemplates.splice(templateIndex, 1);
        localStorage.removeItem("irent_template_" + template);
        localStorage.setItem("irent_templates_list", JSON.stringify(this.irentTemplates));
        if (this.irentTemplates.length > 0) {
          this.selectedTemplate = this.irentTemplates[0].id || "";
          this.loadTemplateContent(this.selectedTemplate);
        } else {
          this.selectedTemplate = "";
          this.$emit("update:content", "");
        }
      }
    },
  },
};
</script>

<style scoped>
.template-toolbar {
  margin:10px 0px;
}
.select-box {
  width: 200px;
  margin-right: 10px;
}
</style>
