<template>
    <!-- 筛选栏 -->
    <div id="filter">
        <ul>
            <li v-for="(item, index) in buttonList" :key="index">
                <a-button :class="['filter-status', { active: currentIndex === index }]" @click="handleClick(index)">
                    {{ item.text }}
                </a-button>
            </li>
        </ul>
    </div>
    <!-- 搜索条件 -->
    <div id="commentForm" style="margin-top: 20px;">
        <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish">
            <!-- 时间控件 -->
            <div id="time">
                <a-space align="center">
                    <!-- 发布时间 -->
                    <a-form-item label="年" name="year">
                        <a-select v-model:value="formState.year" style="width: 120px" placeholder="请选择年份">
                            <a-select-option value="">请选择年份</a-select-option>
                            <a-select-option v-for="item in commentUserHomeVO.timeSet" :value="item" :key="item">{{ item
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
    </div>

    <!-- 列表样式 -->
    <div id="commentList">
        <a-list item-layout="vertical" size="large" :pagination="rolePage" :data-source="commentUserVOList">
            <template #renderItem="{ item }">
                <a-list-item key="item.title">
                    <template #actions>
                        <!-- 操作按钮 -->
                        <div v-if="item.status == 0 || item.status == 1">
                            <a-tooltip>
                                <template #title>点赞数</template>
                                <LikeOutlined style="font-size: 15px;" />
                                <span> {{ item.praiseNumber }}</span>
                            </a-tooltip>
                        </div>
                        <div v-if="item.status == 2">
                            <a-space align="center">
                                <a-button type="text" @click="showReplyForm(item)">回复</a-button>
                            </a-space>
                        </div>

                        <a-tooltip v-if="item.status == 3">
                            <template #title>{{ item.reviewOpinions }}</template>
                            <a-tag color="red">封禁原因</a-tag>
                        </a-tooltip>
                        <a @click="showConfirm(item.id, item.userId)"
                            v-if="item.status == 0 || item.status == 1 || item.status == 3">删除</a>
                    </template>
                    <!-- 我发表的评论 -->
                    <a-list-item-meta v-if="item.status == 0">
                        <template #title>
                            我在 {{ dayjs(formatTime(item.createTime)).fromNow(true) }}前 评论了 <a :href="item.href"
                                style="color: rgb(127, 220, 217);">{{ item.articleUsername }}</a> 的文章<a
                                :href="'/#/article/detail/' + item.articleId" target="_blank"
                                style="color: rgb(127, 220, 217);">{{ item.title }}</a>
                        </template>
                    </a-list-item-meta>
                    <!-- 我回复的评论 -->
                    <div>
                        <a-list-item-meta v-if="item.status == 1">
                            <template #title>
                                我在 {{ dayjs(formatTime(item.createTime)).fromNow(true) }}前 回复了
                                <a :href="item.href" style="color: rgb(127, 220, 217);">{{ item.articleUsername }}</a>
                                的文章
                                <a :href="'/#/article/detail/' + item.articleId" target="_blank"
                                    style="color: rgb(127, 220, 217);">{{ item.title }}</a>下
                            </template>
                        </a-list-item-meta>
                        <div v-if="item.status == 1">
                            <a-space align="center">
                                <a :href="item.href" style="color: rgb(127, 220, 217);">{{ item.username }}</a> 评论的
                                <ArrowRightOutlined />
                                <div v-html="item.receiveContent"></div>
                            </a-space>
                        </div>
                    </div>
                    <!-- 回复我的评论 -->
                    <div v-if="item.status == 2">
                        <a-list-item-meta>
                            <template #title>
                                <a :href="item.href" style="color: rgb(127, 220, 217);">{{ item.username }}</a>在
                                {{ dayjs(formatTime(item.createTime)).fromNow(true) }}前 回复了 我在
                                <a :href="item.href" style="color: rgb(127, 220, 217);">{{ item.articleUsername }}</a>
                                的文章
                                <a :href="'/#/article/detail/' + item.articleId" target="_blank"
                                    style="color: rgb(127, 220, 217);">{{ item.title }}</a>下评论的
                            </template>
                        </a-list-item-meta>
                        <a-space align="center">
                            我
                            <ArrowRightOutlined />
                            <div v-html="item.receiveContent"></div>
                        </a-space>
                    </div>
                    <!-- 被封禁的评论 -->
                    <div v-if="item.status == 3">
                        <a-list-item-meta>
                            <template #title>
                                我在
                                <a :href="item.href" style="color: rgb(127, 220, 217);">{{ item.articleUsername }}</a>
                                的文章
                                <a :href="'/#/article/detail/' + item.articleId" target="_blank"
                                    style="color: rgb(127, 220, 217);">{{ item.title }}</a>下的评论被封禁
                            </template>
                        </a-list-item-meta>
                    </div>

                    <a-space align="center" v-if="item.status == 0 || item.status == 1 || item.status == 3">
                        我
                        <ArrowRightOutlined />
                        <div v-html="item.content"></div>
                    </a-space>
                    <a-space align="center" v-if="item.status == 2">
                        <a :href="item.href" style="color: rgb(127, 220, 217);">{{ item.username }}</a>
                        <ArrowRightOutlined />
                        <div v-html="item.content"></div>
                    </a-space>
                </a-list-item>
                <!-- 回复评论组件 -->
                <div v-if="item.showForm">
                    <div style="border: 1px solid #ccc">
                        <Toolbar style="border-bottom: 1px solid #ccc;width: 100%;height: 50px;"
                            :editor="editorRefChild" :defaultConfig="toolbarConfigChild" mode="default" />
                        <Editor style="width:100%;height: 150px; overflow-y: hidden;" v-model="valueHtmlChild"
                            :defaultConfig="editorConfigChild" mode="default" @onCreated="handleCreatedChild" />
                    </div>
                    <div>
                        <a-button type="primary" html-type="submit" style="width: 100px;margin-top: 10px;"
                            @click="submitForm(item.id, item.articleId)">回复评论</a-button>
                    </div>
                </div>
            </template>
        </a-list>
    </div>
</template>

<script setup lang="ts">
import { addCommentReply, deleteComment, getCommentUserHome, getCommentUserVoList } from '@/api/commment';
import type { CommentAddRequest, CommentUserHomeVO, CommentUserVO, CommentUserWriteRequest } from '@/api/commment/type';
import { computed, createVNode, onBeforeUnmount, onMounted, reactive, ref, shallowRef, type UnwrapRef } from 'vue';
import { ArrowRightOutlined, LikeOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import type { IEditorConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import 'dayjs/locale/zh-cn'; // 引入简体中文
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//评论首页信息
const commentUserHomeVO = ref<CommentUserHomeVO>({
    timeSet: [],
    pageVO: {
        rows: [],
        total: 0
    },
});

//评论列表数据
const commentUserVOList = ref<CommentUserVO[]>();

onMounted(() => {
    getCommentHomeInfo();
})

//获取评论首页信息
const getCommentHomeInfo = async () => {
    const res = await getCommentUserHome();
    if (res.code == 0) {
        Object.assign(commentUserHomeVO.value, res.data);
        rolePage.total = res.data?.pageVO.total
        commentUserVOList.value = res.data?.pageVO.rows;
    }
}

// //筛选栏
const buttonList = ref([
    { text: '我发表的评论' },
    { text: '我回复的评论' },
    { text: '回复我的评论' },
    { text: '被封禁的评论' },
]);
const currentIndex = ref(0);
const handleClick = (index: number) => {
    currentIndex.value = index;
    console.log(index)
    formState.status = index;
    formState.current = 1;
    rolePage.current = 1;
    getCommentUserWriteList(formState)
};
const isMonthDisabled = computed(() => !formState.year);
//分页
const rolePage = reactive({
    current: 1,
    total: 0,
    pageSize: 5,
    //页数改变是触发
    onChange: (current: number) => {
        formState.current = current;
        rolePage.current = current;
        getCommentUserWriteList(formState)
    }
});
//表单数据
const formState = reactive<CommentUserWriteRequest>({
    status: 0, //权限：0：我发表的评论，1：我回复的评论，2：回复我的评论，3：被封禁的评论
    year: undefined,
    month: undefined,
    content: '',
    current: 1,
});
const onFinish = async (values: any) => {
    values.status = currentIndex.value;
    formState.current = 1;
    rolePage.current = 1;
    getCommentUserWriteList(formState);
};

//根据条件获取用户发布的文章信息
const getCommentUserWriteList = async (commentUserWriteRequest: CommentUserWriteRequest) => {
    const res = await getCommentUserVoList(commentUserWriteRequest);
    if (res.code == 0) {
        rolePage.total = res.data?.total
        commentUserVOList.value = res.data?.rows;
    } else {
        message.error(res.message);
    }
}

//清空筛选条件
const doClear = () => {
    formState.month = undefined;
    formState.year = undefined;
    formState.current = 1;
    rolePage.current = 1;
    formState.content = '';
    getCommentUserWriteList(formState);
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

const commentDeleteRequest = {
    userId: 0,
    commentId: 0
}
//删除评论
const showConfirm = (commentId: number, userId: number) => {
    Modal.confirm({
        title: '您确定要删除评论吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '如果该评论有子评论也将会被一起删除！',
        async onOk() {
            commentDeleteRequest.userId = userId;
            commentDeleteRequest.commentId = commentId
            const res = await deleteComment(commentDeleteRequest);
            if (res.code == 0 && res.data) {
                message.success('删除成功！')
                getCommentUserWriteList(formState);
                currentIndex.value = 0;
            } else {
                message.error('删除失败！')
            }
        },
        onCancel() { },
    });
};

//自回复框
const record = ref<CommentUserVO>();
const showReplyForm = (comment) => {
    if (comment.showForm == true) {
        comment.showForm = false;
        valueHtmlChild.value = '';
        editorRefChild.value = undefined
    } else {
        if (record.value == undefined) {
            valueHtmlChild.value = '';
            if (record.value?.showForm == false) {
                editorRefChild.value = undefined
            }
            comment.showForm = true;
            record.value = comment;
        } else {
            valueHtmlChild.value = '';
            editorRefChild.value = undefined
            record.value.showForm = false;
            comment.showForm = true;
            record.value = comment
        }
    }
}

const editorRefChild = shallowRef()
const valueHtmlChild = ref('')
const toolbarConfigChild = {}
toolbarConfigChild.toolbarKeys = [
    // 菜单 key
    'headerSelect',
    // 分割线
    '|',
    // 菜单 key
    'bold', 'italic',
    'color', 'fontSize', 'emotion',
    // 菜单组，包含多个菜单
    {
        key: 'group-more-style', // 必填，要以 group 开头
        title: '更多样式', // 必填
        iconSvg: '<svg>....</svg>', // 可选
        menuKeys: ["through", "code", "clearStyle"] // 下级菜单 key ，必填
    },
]

// 初始化 MENU_CONF 属性
const editorConfigChild: Partial<IEditorConfig> = {
    MENU_CONF: {},
    placeholder: '请输入内容...'
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editorChild = editorRefChild.value
    if (editorChild == null) return
    editorChild.destroy()
})

const handleCreatedChild = (editorChild: any) => {
    if (editorRefChild.value == undefined) {
        editorRefChild.value = editorChild // 记录 editor 实例，重要！
    }
}

//子评论数据
const formData: UnwrapRef<CommentAddRequest> = reactive({
    content: '',//内容
    parentId: undefined,//父评论Id
    articleId: undefined,//文章id
    isTop: 1,//是否为顶层评论（0：是，1：不是）
});
// 提交表单的方法  
const submitForm = async (parentId: number, articleId: number) => {
    // //获取富文本中的数据
    formData.content = valueHtmlChild.value;
    formData.parentId = parentId;
    formData.articleId = articleId;
    const res = await addCommentReply(formData)
    if (res.code == 0 && res.data) {
        message.success("发送评论成功")
        formState.content = '';
        //加载评论区
        getCommentUserWriteList(formState);
        valueHtmlChild.value = '';
    } else {
        message.error(res.message)
    }
};

dayjs.extend(relativeTime);
dayjs.locale('zh-cn'); // 设置为简体中文
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

.filter-status {
    border: none;
    outline: none;
    color: black;
}

.filter-status.active {
    color: rgb(93, 197, 242);
    /* active button style */
}
</style>