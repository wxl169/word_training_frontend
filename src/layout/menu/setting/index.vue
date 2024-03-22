<template>
  <a-tooltip title="刷新">
    <a-button type="dashed" shape="circle" :icon="h(RedoOutlined)" @click="updateRefsh" />
  </a-tooltip>
  <a-tooltip title="全屏">
    <a-button type="dashed" shape="circle" :icon="h(ExpandOutlined)" @click="fullScreen" style="margin-left: 5px;" />
  </a-tooltip>


  <template v-if="userStore.username == ''">

    <a-button type="dashed" style="margin-left:20px" @click="toLogin">登录账号</a-button>
  </template>

  <template v-else>
    <img :src="userStore.avatar" style="width: 55px;height: 55px; margin:0px 10px;border-radius: 50%;">
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent>
        {{ userStore.username }}
        <DownOutlined />
      </a>
      <template #overlay>
        <a-menu style="text-align: center;">
          <a-menu-item>
            <RouterLink to="/user/detail">个人信息</RouterLink>
          </a-menu-item>
          <a-menu-item>
            <RouterLink to="/user/release">我的发布</RouterLink>
          </a-menu-item>
          <a-menu-item>
            <a @click="logout">退出登录</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </template>
</template>



<script lang="ts" setup>
import { h } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  RedoOutlined, ExpandOutlined
} from '@ant-design/icons-vue';

let layoutSettingStore = useLayOutSettingStore();
let userStore = useUserStore();
//获取路由器对象
let $router = useRouter();
//获取路由对向
let $route = useRoute();
//收集开关的数据
let dark = ref<boolean>(false);


//刷新按钮点击回调
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh;
};

//全屏按钮点击的回调
const fullScreen = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement;
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen();
  }
}

//退出登录点击回调
const logout = async () => {
  await userStore.userLogout();
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } });
}

//前往登录页面
const toLogin = () => {
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } });
}
</script>


<style scoped></style>