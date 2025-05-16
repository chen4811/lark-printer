import { createApp } from "vue";

import "element-plus/theme-chalk/display.css";
import "./assets/main.css";

import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 导入样式

const app = createApp(App);

app.use(ElementPlus); // 注册 Element Plus

app.mount("#app");
