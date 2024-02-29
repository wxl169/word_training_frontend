<template>
   <a-layout class="layout">
    <a-layout-header style="display: flex; align-items: center;">
        <Logo style="margin-right: 150px;" />
        <!-- 根据路由动态生成菜单 -->
        <Menu :collapse="LayOutSettingStore.fold ? true : false"></Menu>
    </a-layout-header>

    <a-layout-content>    
        <div class="layout_content" :class="{ fold: LayOutSettingStore.fold ? true : false }">
            <Main></Main>
        </div>
    </a-layout-content>

    <a-layout-footer style="text-align: center; position: fixed; bottom: 0; left: 0; right: 0;">
        英语单词训练系统 ©2024 Created by cqie_wxl
    </a-layout-footer>
</a-layout>

</template>

  
<script lang="ts" setup>
import { useRoute } from 'vue-router'
//引入顶部菜单Logo子组件
import Logo from './logo/index.vue';
//引入顶部菜单组件
import Menu from './menu/index.vue';
import Main from './main/index.vue';



//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
import useLayOutSettingStore from '@/store/modules/setting';

let userStore = useUserStore();
//获取layout配置仓库

let LayOutSettingStore = useLayOutSettingStore();

//获取路由对象
let $route = useRoute();
</script>


<style scoped>
.site-layout-content {
    min-height: 280px;
    padding: 24px;
    background: #fff;
}

#components-layout-demo-top .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top .logo {
    float: right;
    margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
    background: #141414;
}

.layout_content {
    background: #fff;
    padding: 0 24px 24px 24px;
}

.logo-img {
    width: 64px;
    height: 64px;
}

.ant-layout-footer{
    padding: 10px 50px;
}
</style>
  