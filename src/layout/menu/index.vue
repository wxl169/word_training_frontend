<template>
    <div class="menu">
        <div class="menu_left">
            <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="horizontal" theme="dark"
                :items="filteredItems" @click="handleClick" />
        </div>
        <div class="menu_right">
            <Setting />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, h, onMounted, ref } from 'vue';
import {
    HomeOutlined, AppstoreOutlined, SettingOutlined, UserOutlined, ReadOutlined, LaptopOutlined, ReconciliationOutlined,
    TagOutlined, ProfileOutlined, ExclamationCircleFilled, BookOutlined, PartitionOutlined, VerifiedOutlined,BankOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import type { MenuProps } from 'ant-design-vue';
import Setting from './setting/index.vue';
import useUserStore from '@/store/modules/user';
import pinia from '@/store';
import { Item } from 'ant-design-vue/es/menu';

const router = useRouter(); // 获取路由实例   
const selectedKeys = ref<string[]>([]);
const openKeys = ref([]);
const userStore = useUserStore(pinia)

onMounted(() => {  
  const savedKeys = localStorage.getItem('selectedKeys');  
  if (savedKeys) {  
    selectedKeys.value = JSON.parse(savedKeys);  
  } else {  
    // 如果没有保存的值，则设置默认值  
    selectedKeys.value = ['home'];  
  }  
});  

//菜单路由
const items = ref([
    //首页
    {
        key: 'home',
        icon: () => h(HomeOutlined),
        label: '首页',
        title: 'home',
        path: '/home'
    },
    //单词训练
    {
        key: 'word_training',
        icon: () => h(LaptopOutlined),
        label: '单词训练',
        title: 'word_training',
        path: '/word/training'
    },
    //单词库
    {
        key: 'bank',
        icon: () => h(ReadOutlined),
        label: '单词库',
        title: 'bank',
        children: [
            {
                key: 'word_bank',
                path: '/word/bank',
                title: 'word_bank',
                icon: () => h(ReadOutlined),
                label: '单词百科',
            },
            {
                key: 'error_word_bank',
                path: '/word/bank/error',
                title: 'error_word_bank',
                icon: () => h(ReconciliationOutlined),
                label: '错题库',
            },
        ],
    },
    //社区
     //单词库
     {
        key: 'community',
        icon: () => h(BankOutlined),
        label: '社区',
        title: 'community',
        path: '/community/home',
        // children: [
        //     {
        //         key: 'word_bank',
        //         path: '/word/bank',
        //         title: 'word_bank',
        //         icon: () => h(ReadOutlined),
        //         label: '单词百科',
        //     },
        //     {
        //         key: 'error_word_bank',
        //         path: '/word/bank/error',
        //         title: 'error_word_bank',
        //         icon: () => h(ReconciliationOutlined),
        //         label: '错题库',
        //     },
        // ],
    },
    //系统管理
    {
        key: 'system',
        path: "/system",
        title: "systemManage",
        label: "系统管理",
        icon: () => h(AppstoreOutlined),
        children: [
            {
                path: "/system/user",
                key: "system_user",
                title: "system_user",
                label: "用户管理",
                icon: () => h(UserOutlined),
            },
            {
                path: "/system/word",
                key: "system_word",
                label: "单词管理",
                title: "system_word",
                icon: () => h(ReadOutlined),
            },
            {
                path: "/system/wordType",
                key: "system_word_type",
                label: "单词类型管理",
                title: "system_word_type",
                icon: () => h(PartitionOutlined),
            },
            {
                path: "/system/article",
                key: "system_article",
                label: "文章管理",
                title: "system_article",
                icon: () => h(ProfileOutlined),
            },
            {
                path: "/system/tag",
                key: "system_tag",
                label: "标签管理",
                title: "system_tag",
                icon: () => h(TagOutlined),
            },
            {
                path: "/system/task",
                key: "system_task",
                label: "任务管理",
                title: "system_task",
                icon: () => h(BookOutlined),
            },
            {
                path: "/system/medal",
                key: "system_medal",
                label: "勋章管理",
                title: "system_medal",
                icon: () => h(VerifiedOutlined),
            },
            {
                path: "/system/complain",
                key: "system_complain",
                label: "投诉管理",
                title: "system_complain",
                icon: () => h(ExclamationCircleFilled),
            },
        ],
    },
]);

const handleClick: MenuProps['onClick'] = menuInfo => {
    router.push(menuInfo.item.path);
    selectedKeys.value = [menuInfo.item.originItemValue.title];  
    localStorage.setItem('selectedKeys', JSON.stringify(selectedKeys.value));  
};


//判断是否为管理员
function isAdmin() {  
  // 这里可以根据实际情况，例如检查localStorage、vuex store等来确定用户角色  
  return userStore.role === 'admin';  
}  

//根据用户身份筛选菜单
const filteredItems = computed(() => {  
      if (!isAdmin()) {  
        // 如果不是管理员，则从items中移除“系统管理”及其子项  
        const newItems = [...items.value];  
        const systemIndex = newItems.findIndex(item => item.key === 'system');  
        if (systemIndex !== -1) {  
          newItems.splice(systemIndex, 1);  
        }  
        return newItems;  
      }  
      // 如果是管理员，则返回原始菜单项  
      return items.value;  
    });  
</script>



<style scoped>
.menu {
    width: calc(100% - 150px - 64px - 200px);
    display: flex;
    justify-content: space-between;
    /* background-image: linear-gradient(to right, rgb(232, 223, 223), rgb(201, 178, 178), rgb(197, 165, 165)); */
}
    .menu_left {
        display: flex;
        align-items: center;
        margin-left: 20px;

    }

    .menu_right {
        display: flex;
        align-items: center;
    }
</style>
  
  