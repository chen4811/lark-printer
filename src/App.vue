<template>
  <div>
    <div class="main-container">
      <TemplateManager :is-edited="isEdited" v-model:content.sync="content"
        v-model:selected-template.sync="selectedTemplate" />
      <EditorToolBar :isEdited="isEdited" @update:isEdited="toggleEditorMode"
        @update:isPrintSettingsVisible="isPrintSettingsVisible = $event" />
      <div class="content-wrapper">
        <LarkFieldsList v-if="isEdited" :editorInstance="editorInstance" :isOpen="isOpenDrawer" />
        <div class="editor-container" :class="{ 'full-width': !isEdited }">
          <Editor id="editor" tinymce-script-src="/tinymce/tinymce.min.js" :init="editorConfig"
            v-model="content" />
        </div>
        <PrintSettingsDialog :visible="isPrintSettingsVisible" :settings="printSettings"
          @update:visible="isPrintSettingsVisible = $event" @update:settings="printSettings = $event" />
      </div>
    </div>
  </div>
</template>

<script>
import { bitable } from "@lark-base-open/js-sdk";
import Editor from "@tinymce/tinymce-vue";
import TemplateManager from "@/components/TemplateManager.vue";
import EditorToolBar from "@/components/EditorToolBar.vue";
import PrintSettingsDialog from "@/components/PrintSettingsDialog.vue";
import BatchDialog from "./components/BatchDialog.vue";
import LarkFieldsList from "@/components/LarkFieldsList.vue";
import { registerButtons } from "@/plugins/tinymce-plugins";
import { applyTemplate, revertTemplate } from "@/plugins/content";

export default {
  components: {
    Editor,
    EditorToolBar,
    TemplateManager,
    PrintSettingsDialog,
    BatchDialog,
    LarkFieldsList,
  },
  data() {
    return {
      dialogVisible: false,
      intervalId: null,
      count: 0,
      isEdited: false,
      selectedTemplate: null,
      isOpenDrawer: false,
      editorInstance: null,
      content: "",
      printSettings: {
        orientation: "portrait",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
      },
      isPrintSettingsVisible: false, // 控制打印设置弹窗的显示与隐藏
    };
  },
  computed: {
    editorConfig() {
      return {
        language: "zh_CN",
        base_url: '/tinymce/',
        suffix: '.min',
        // 启用的插件
        plugins: "image table preview autoresize fullscreen insertdatetime",
        // 隐藏菜单栏
        menubar: false,
        // 隐藏状态栏
        statusbar: false,
        // 工具栏按钮
        toolbar: [
          'undo redo | fontfamily fontsize | bold italic underline strikethrough',
          'alignleft aligncenter alignright alignjustify | image insertdatetime table | fullscreen preview newprint exportpdf'
        ],

        font_family_formats: `
        微软雅黑=Microsoft YaHei, Helvetica Neue, PingFang SC, sans-serif;
        苹果苹方=PingFang SC, Microsoft YaHei, sans-serif;
        宋体=simsun, serif;
        仿宋体=FangSong, serif;
        黑体=SimHei, sans-serif;
        Arial=arial, helvetica, sans-serif;
        Arial Black=arial black, avant garde;
        Book Antiqua=book antiqua, palatino
      `,
        // 允许上传图片
        file_picker_types: "image",
        // 图片上传逻辑
        file_picker_callback: function (callback, value, meta) {
          if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = function () {
              const file = this.files[0];
              const reader = new FileReader();
              reader.onload = function (e) {
                callback(e.target.result, { alt: file.name });
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }
        },
        // 初始化编辑器实例
        setup: (editor) => {
          this.editorInstance = editor;
          // 注册自定义按钮（如 newprint/exportpdf）
          registerButtons(editor, () => this.printSettings);
          // 編輯器初始化完成後
          editor.on("init", () => {
            // 根据 isEdited 设置编辑模式
            this.toggleEditorMode();
          });
        },
      };
    },

    dynamicContentStyle() {
      return `
        @media print {
          @page {
            margin-top: ${this.printSettings.marginTop}px;
            margin-bottom: ${this.printSettings.marginBottom}px;
            margin-left: ${this.printSettings.marginLeft}px;
            margin-right: ${this.printSettings.marginRight}px;
            ${this.printSettings.orientation === "landscape"
          ? "size: landscape;"
          : "size: portrait;"
        }
          }
        }
      `;
    },
  },
  watch: {
    // 監控 dynamicContentStyle 的變化，並呼叫 updateEditorStyle 更新樣式
    dynamicContentStyle(newStyle) {
      this.updateEditorStyle();
    },
  },
  async mounted() {
    this.toggleEditorMode();
    let self = this;

    bitable.base.onSelectionChange(async (event) => {
      if (this.isEdited) {
        self.content = await revertTemplate(this.content);
      } else {
        self.content = await applyTemplate(this.content);
      }
    });

    this.selectedRecord();
    this.intervalId = setInterval(() => {
      self.selectedRecord();
    }, 1000);
  },
  onUnmounted() {
    clearInterval(this.intervalId);
  },
  methods: {
    async selectedRecord() {
      const activeTable = await bitable.base.getActiveTable();
      const selection = await bitable.base.getSelection();
      const view = await activeTable.getViewById(selection.viewId);

      let selectRecordList = await view.getSelectedRecordIdList();

      if (selectRecordList.length > 0) {
        if (this.isEdited) {
          this.content = await revertTemplate(this.content);
        } else {
          this.content = await applyTemplate(this.content, selectRecordList[0]);
        }
      }

      if (selectRecordList.length > 1) {
        this.dialogVisible = true;
      } else {
        this.dialogVisible = false;
      }
    },
    async toggleEditorMode() {
      this.isEdited = !this.isEdited;
      if (this.editorInstance) {
        this.editorInstance.mode.set(this.isEdited ? "design" : "readonly"); // 編輯模式
        this.applyIframeStyles();
        if (this.isEdited) {
          this.content = await revertTemplate(this.content);
        } else {
          this.content = await applyTemplate(this.content);
        }
      }
    },
    applyIframeStyles() {
      const iframe = this.editorInstance.iframeElement;
      if (iframe) {
        if (this.isEdited) {
          iframe.style.pointerEvents = "auto"; // 恢復點擊
          iframe.style.userSelect = "text"; // 恢復選取
          iframe.contentDocument.body.style.cursor = "text"; // 顯示游標
        } else {
          iframe.style.pointerEvents = "none"; // 禁止點擊與聚焦
          iframe.style.userSelect = "none"; // 禁止選取內容
          iframe.contentDocument.body.style.cursor = "default"; // 游標消失
        }
      }
    },

    openPrintSettings() {
      this.isPrintSettingsVisible = true;
    },

    handlePrintSettings(settings) {
      this.printSettings = settings;
      this.updateEditorStyle();
      this.isPrintSettingsVisible = false;
    },

    updateEditorStyle() {
      const iframe = this.editorInstance.iframeElement;
      if (iframe && iframe.contentDocument) {
        const head = iframe.contentDocument.head;

        // 查找是否已經有我們插入的 style 標籤
        let existingStyleTag =
          iframe.contentDocument.getElementById("dynamic-style-tag");

        if (!existingStyleTag) {
          // 如果沒有，創建一個新的 style 標籤
          existingStyleTag = iframe.contentDocument.createElement("style");
          existingStyleTag.id = "dynamic-style-tag"; // 設置 id 來避免重複
          head.appendChild(existingStyleTag); // 添加到 head
        }

        // 更新 style 標籤的內容
        existingStyleTag.innerHTML = this.dynamicContentStyle;
      }
    },
  },
};
</script>

<style>
.template-field {
  max-width: fit-content !important;
}

.main-container {
  margin: 0 auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.content-wrapper {
  display: flex;
  gap: 5px;
  height: calc(100vh - 80px);
  margin-top: 10px;
}

.editor-container {
  flex: 1;
  min-width: 0;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.editor-container.full-width {
  width: 100%;
}

/* 美化TinyMCE编辑器 */
:deep(.tox-tinymce) {
  border-radius: 6px;
  border: none !important;
}

:deep(.tox-toolbar) {
  background-color: #f5f7fa !important;
  border-bottom: 1px solid #e4e7ed !important;
}

:deep(.tox-statusbar) {
  border-top: 1px solid #e4e7ed !important;
}
</style>
