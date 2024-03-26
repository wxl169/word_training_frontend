<template>
    <!-- 筛选栏 -->
    <div id="filter">
        <strong style="font-size: 15px;">状态</strong>
        <ul style="margin-left: 50px;">
            <li v-for="(item, index) in buttonList" :key="index">
                <a-button :class="['filter-status', { active: currentIndex === index }]" @click="handleClick(index)">
                    {{ item.text }}({{ item.count }})
                </a-button>
            </li>
        </ul>
    </div>
    <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish">
        <!-- 时间控件 -->
        <div id="time">
            <a-space align="center">
                <!-- 发布时间 -->
                <a-form-item label="年" name="year">
                    <a-select v-model:value="formState.year" style="width: 120px" placeholder="请选择年份">
                        <a-select-option value="">请选择年份</a-select-option>
                        <a-select-option v-for="item in articleNumVO.timeSet" :value="item" :key="item">{{ item
                            }}</a-select-option>
                    </a-select>
                </a-form-item>
                <!-- 月 -->
                <a-form-item label="月" name="month">
                    <a-select v-model:value="formState.month" style="width: 120px" :disabled="isMonthDisabled"
                        placeholder="请选择月份">
                        <a-select-option value="">请选择月份</a-select-option>
                        <a-select-option v-for="item in Array.from({ length: 12 }, (_, i) => i + 1)" :value="item"
                            :key="item">
                            {{ item }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <!-- 标签 -->
                <div style="margin-left: 10px;">
                    <a-form-item name="tagName" label="标签">
                        <a-select ref="select" v-model:value="formState.tagName" style="width: 200px" mode="multiple"
                            placeholder="请选择标签">
                            <a-select-option v-for="item in articleNumVO.tagSet" :value="item" :key="item">{{ item
                                }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <!-- 关键词 -->
                <div style="margin-left:40px;">
                    <a-form-item name="content" label="关键词">
                        <a-input v-model:value="formState.content" placeholder="请输入关键词" />
                    </a-form-item>
                </div>
                <div>
                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-space align="center">
                            <a-button type="primary" html-type="submit">搜索</a-button>
                            <a-button @click="doClear()">清空</a-button>
                        </a-space>
                    </a-form-item>
                </div>
            </a-space>
        </div>
    </a-form>
    <!-- 内容列表 -->
    <div id="content">
        <a-list item-layout="vertical" size="large" :pagination="rolePage" :data-source="articleByUserIdVOList">
            <template #renderItem="{ item }">
                <a-list-item key="item.title" class="custom-list-item">
                    <template #actions>
                        <!-- 发布时间 -->
                        <!-- <span>{{ formatTime(item.createTime) }}</span> -->
                        <span>{{ formatTime(item.createTime) }}</span>
                        <div>
                            <a-tooltip>
                                <template #title>浏览量</template>
                                <EyeOutlined style="font-size: 20px;" />
                                <span> {{ item.visitNumber }}</span>
                            </a-tooltip>
                            <a-tooltip>
                                <template #title>收藏量</template>
                                <HeartOutlined style="margin-left:10px" />
                                <span> {{ item.collectionNumber }}</span>
                            </a-tooltip>
                            <a-tooltip>
                                <template #title>点赞量</template>
                                <LikeOutlined style="margin-left:10px" />
                                <span> {{ item.praiseNumber }}</span>
                            </a-tooltip>
                            <a-tooltip>
                                <template #title>评论量</template>
                                <CommentOutlined style="margin-left:10px" />
                                <span> {{ item.commentNumber }}</span>
                            </a-tooltip>
                        </div>
                        <a :href="'/#/article/update/' + item.id" v-if="item.status != 4">编辑</a>
                        <a :href="'/#/article/detail/' + item.id" target="_blank" v-if="item.status == 0">浏览</a>
                        <a @click="showConfirm(item.id)">删除</a>
                    </template>
                    <template #extra>
                        <img width="200" height="150" alt="logo" :src="item.coverImage" v-if="item.coverImage != null"
                            style="padding-top: 10px;">
                    </template>
                    <a-list-item-meta :description="item.description">
                        <template #title>
                            <a :href="'/#/article/detail/' + item.id" target="_blank">{{ item.title }}</a>
                            <br>
                            <!-- 标签组 -->
                            <a-tag color="green" v-if="item.status == 0">正常发布</a-tag>
                            <a-tag color="pink" v-if="item.status == 1">审核中</a-tag>
                            <a-tag color="orange" v-if="item.status == 2">整改中</a-tag>
                            <a-tag v-if="item.status == 3">草稿</a-tag>
                            <a-tag color="red" v-if="item.status == 4">封禁</a-tag>
                            <a-tag color="green" v-if="item.permissions == 0">公开</a-tag>
                            <a-tag color="cyan" v-if="item.permissions == 1">私有</a-tag>
                            <a-tag color="purple" v-if="item.permissions == 2">仅对好友开放</a-tag>
                            <a-tag color="blue" v-for="tag in item.tagList" :key="tag">{{ tag }}</a-tag>
                            <a-tooltip>
                                <template #title>{{ item.reviewOpinions }}</template>
                                <a-tag color="red" v-if="item.status == 2">审核修改意见</a-tag>
                            </a-tooltip>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<script setup lang="ts">

import { deleteArticleById, getArticleNumVO, getArticleUserWrite } from '@/api/article';
import type { ArticleByUserIdVO, ArticleNumVO, ArticleUserWriteDTO } from '@/api/article/type';
import { computed, onMounted, reactive, ref } from 'vue';
import { EyeOutlined, LikeOutlined, HeartOutlined, CommentOutlined } from '@ant-design/icons-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal, message } from 'ant-design-vue';

const articleNumVO = ref<ArticleNumVO>({
    allNumber: 0,
    openNumber: 0,
    privateNumber: 0,
    concernNumber: 0,
    processNumber: 0,
    draftNumber: 0,
    rectificationNumber: 0,
    banNumber: 0,
    timeSet: [],
    tagSet: [],
    pageVO: {
        rows: [],
        total: 0
    },
});
const isMonthDisabled = computed(() => !formState.year);
//文章数据
const articleByUserIdVOList = ref<ArticleByUserIdVO[]>();
//初始化数据
onMounted(() => {
    getArticleNumVOList();
})
//获取首页信息
const getArticleNumVOList = async () => {
    const res = await getArticleNumVO();
    if (res.code == 0) {
        Object.assign(articleNumVO.value, res.data);
        buttonList.value = [
            { text: '全部', count: articleNumVO.value.allNumber },
            { text: '全部可见', count: articleNumVO.value.openNumber },
            { text: '仅自己可见', count: articleNumVO.value.privateNumber },
            { text: '仅关注自己的用户可见', count: articleNumVO.value.concernNumber },
            { text: '草稿箱', count: articleNumVO.value.draftNumber },
            { text: '审核中', count: articleNumVO.value.processNumber },
            { text: '需整改', count: articleNumVO.value.rectificationNumber },
            { text: '已被封禁', count: articleNumVO.value.banNumber },
        ];
        rolePage.total = res.data?.pageVO.total
        articleByUserIdVOList.value = res.data?.pageVO.rows;
    }
}

// //筛选栏
const buttonList = ref([
    { text: '全部', count: articleNumVO.value.allNumber },
    { text: '全部可见', count: articleNumVO.value.openNumber },
    { text: '仅自己可见', count: articleNumVO.value.privateNumber },
    { text: '仅关注自己的用户可见', count: articleNumVO.value.concernNumber },
    { text: '草稿箱', count: articleNumVO.value.draftNumber },
    { text: '审核中', count: articleNumVO.value.processNumber },
    { text: '需整改', count: articleNumVO.value.rectificationNumber },
    { text: '已被封禁', count: articleNumVO.value.banNumber },
]);
const currentIndex = ref(0);
const handleClick = (index: number) => {
    currentIndex.value = index;
    formState.status = index;
    formState.current = 1;
    rolePage.current = 1;
    getArticleUserWriteList(formState)
};


//分页
const rolePage = reactive({
    current: 1,
    total: 0,
    pageSize: 3,
    //页数改变是触发
    onChange: (current: number) => {
        formState.current = current;
        rolePage.current = current;
        getArticleUserWriteList(formState)
    }
});

//表单数据
const formState = reactive<ArticleUserWriteDTO>({
    status: 0,
    year: undefined,
    month: undefined,
    content: '',
    tagName: [],
    current: 1,
});
const onFinish = async (values: any) => {
    values.status = currentIndex.value;
    formState.current = 1;
    rolePage.current = 1;
    getArticleUserWriteList(formState);
};

//根据条件获取用户发布的文章信息
const getArticleUserWriteList = async (articleUserWriteDTO: ArticleUserWriteDTO) => {
    const res = await getArticleUserWrite(articleUserWriteDTO);
    if (res.code == 0) {
        rolePage.total = res.data?.total
        articleByUserIdVOList.value = res.data?.rows;
    } else {
        message.error(res.message);
    }
}

//清空筛选条件
const doClear = () => {
    formState.month = undefined;
    formState.year = undefined;
    formState.content = '';
    formState.tagName = [];
    formState.current = 1;
    rolePage.current = 1;
    getArticleUserWriteList(formState)
}

//时间格式化
const formatTime = (timeArray: number[]) => {
    if (timeArray !== null && timeArray !== undefined) {
        const date = new Date(...timeArray);
        // 获取年、月、日、时、分、秒
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth())).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        // 拼接成格式化后的时间字符串，例如：2024-02-16 10:23:06
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
};

const idRequest = {
    id: 0
}

//删除文章
const showConfirm = (articleId: number) => {
    Modal.confirm({
        title: '您确定要删除这篇文章吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '当您点击确认后，文章将被删除，无法恢复！',
        okText() {
            return '确定';
        },
        cancelText() {
            return '取消';
        },
        async onOk() {
            idRequest.id = articleId;
            const res = await deleteArticleById(idRequest);
            if (res.code == 0 && res.data) {
                message.success('删除成功！')
                getArticleNumVOList();
                currentIndex.value = 0;
            } else {
                message.error('删除失败！')
            }
        },
        onCancel() { },
    });
};
</script>

<style scoped>
#filter {
    display: flex;
    align-items: center;
}

ul {
    list-style-type: none;
    /* 去掉默认的列表符号 */
    padding: 0;
    /* 去掉默认的内边距 */
    margin: 0;
    /* 去掉默认的外边距 */
    display: flex;
    align-items: center;
    /* 垂直居中 */
}

ul li {
    margin-right: 10px;
    /* 为列表项之间添加一些空间 */
}

span {
    margin-right: 10px;
    /* 为状态标签后面添加一些空间 */
}

.filter-status {
    border: none;
    outline: none;
    color: black;
}

.filter-status.active {
    color: rgb(93, 197, 242);
    /* active button style */
}

#time {
    margin-top: 20px;
}

.custom-list-item {
    padding: 0px 10px 10px 10px;
}
</style>