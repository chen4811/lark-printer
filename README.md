# Lark Base Printer

- 使用 Vue 撰寫
- 使用 Github Page & Github action

## Highlight
- `plugins/content.js` : 转换编辑模式与显示模式
- `plugins/tinymce-plugins.js` : 扩展 `tinymce` 的自定义模块，当前功能是 `输出 pdf`


## Components
- `BatchDialog.vue` : 可以暂时忽略，这是之前实现的批量显示模式部分
- `EditorToolBar.vue`: 编辑器工具栏
- `FieldCard.vue` 和 `FieldCollapse.vue` : 字段列表与关联字段
- `LarkFieldsList.vue` : Lark 字段列表
- `Login.vue` 登入
- `PrintSettingsDialog.vue`: 打印设置
- `TemplateManager.vue`: 模板管理
