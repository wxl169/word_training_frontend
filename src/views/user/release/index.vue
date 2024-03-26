<template>
    <a-card style="width: 100%" :tab-list="tabList" :active-tab-key="key"
        @tabChange="(key: string) => onTabChange(key, 'key')">
        <template #customTab="item">
            <span v-if="item.key === 'tab1'">
                <ReadOutlined />
                {{ item.tab }}
            </span>
            <span v-if="item.key === 'tab2'">
                <MessageOutlined />
                {{ item.tab }}
            </span>
        </template>
        <!-- 文章 -->
        <div v-if="key === 'tab1'">
            <UserArticle></UserArticle>
        </div>
        <!-- 评论 -->
        <div v-else-if="key === 'tab2'">
            <UserComment></UserComment>
        </div>
    </a-card>

</template>
<script lang="ts" setup>
import { ReadOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import UserArticle from '@/components/user_article/index.vue';
import UserComment from '@/components/user_comment/index.vue';

//   菜单栏
const tabList = [
    {
        key: 'tab1',
        tab: '文章',
    },
    {
        key: 'tab2',
        tab: '评论',
    },
];
const key = ref('tab1');
const noTitleKey = ref('app');
//点击菜单栏更新数据
const onTabChange = (value: string, type: string) => {
    console.log(value, type);
    if (type === 'key') {
        key.value = value;
    } else if (type === 'noTitleKey') {
        noTitleKey.value = value;
    }
};



</script>

<style scoped></style>