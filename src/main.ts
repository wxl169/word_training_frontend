// import './assets/main.css'
import "./assets/global.css";
//引入路由鉴权文件
import "./permisstion";
//  引入createApp用于创建应用
import { createApp } from "vue";
//  引用App根组件
import App from "./App.vue";
import router from "./router";
//引入仓库
import pinia from "./store";
//导入组件库
import * as antIcons from "@ant-design/icons-vue";
//导入富文本组件
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'



const app = createApp(App);
//安装仓库
app.use(pinia);
// 添加到全局
app.config.globalProperties.$antIcons = antIcons;
app.use(router);
app.mount("#app");
app.component("Editor",Editor)
app.component("Toolbar",Toolbar)
