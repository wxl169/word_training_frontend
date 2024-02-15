// import './assets/main.css'
import './assets/global.css'

//  引入createApp用于创建应用
import { createApp } from 'vue'
//  引用App根组件
import App from './App.vue'
import router from './router'
//引入仓库
import pinia from './store'
//导入组件库
import * as antIcons from '@ant-design/icons-vue'
import STable from '@surely-vue/table';

const app = createApp(App);
//安装仓库
app.use(pinia);
// 添加到全局
app.config.globalProperties.$antIcons = antIcons
app.use(router);
app.use(STable);

//引入路由鉴权文件
import './permisstion'
app.mount('#app')
