<template>
    <div>
        <a-comment id="message_content" v-for="comment in props.commentList" :key="comment.id">
            <template #actions>
                <a-layout>
                    <a-layout-header class="headerStyle">
                        <!-- 点赞 -->
                        <span key="comment-basic-like" style="margin-right: 10px;">
                            <a-tooltip title="取消点赞" v-if="comment.isPraise == 1">
                                <a-button type="text" @click="unDoPraise(comment.id, comment.articleId)">
                                    <template #icon>
                                        <LikeFilled style="font-size: 15px" />
                                    </template>
                                    <span style="font-size: 15px;">{{ comment.praiseNumber }}</span>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip title="点赞" v-else>
                                <a-button type="text" @click="doPraise(comment.id, comment.articleId)">
                                    <template #icon>
                                        <LikeOutlined style="font-size: 15px" />
                                    </template>
                                    <span style="font-size: 15px;">{{ comment.praiseNumber }}</span>
                                </a-button>
                            </a-tooltip>
                        </span>
                        <a-button type="text" @click="showReplyForm(comment)">回复</a-button>
                        <!-- 投诉/删除 -->
                        <a-dropdown>
                            <a class="ant-dropdown-link" @click.prevent style="color: black;margin-left: 30px;">
                                <BarsOutlined />
                            </a>
                            <template #overlay>
                                <a-menu style="text-align: center;">
                                    <a-menu-item>
                                        <a-button type="text" @click="visible = true"
                                            style="width: 100%;height: 100%;">投诉</a-button>
                                    </a-menu-item>
                                    <a-menu-item v-if="loginUserId == comment.userId">
                                        <a-button type="text"
                                            @click="showDeleteConfirm(comment.id, comment.userId, comment.articleId)"
                                            style="width: 100%;height: 100%;">删除</a-button>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </a-layout-header>

                    <!-- 内容区 -->
                    <a-layout-content class="contentStyle">
                        <div v-if="comment.showForm">
                            <div style="border: 1px solid #ccc">
                                <Toolbar style="border-bottom: 1px solid #ccc;width: 800px;height: 50px;"
                                    :editor="editorRefChild" :defaultConfig="toolbarConfigChild" mode="default" />
                                <Editor style="width: 800px;height: 150px; overflow-y: hidden;" v-model="valueHtmlChild"
                                    :defaultConfig="editorConfigChild" mode="default" @onCreated="handleCreatedChild" />
                            </div>
                            <div v-if="comment.topId == null">
                                <a-button type="primary" html-type="submit" style="width: 100px;margin-top: 10px;"
                                    @click="submitForm(comment.id, comment.id, comment.articleId)">发表评论</a-button>
                            </div>
                            <div v-else>
                                <a-button type="primary" html-type="submit" style="width: 100px;margin-top: 10px;"
                                    @click="submitForm(comment.id, comment.topId, comment.articleId)">发表评论</a-button>
                            </div>
                        </div>

                    </a-layout-content>
                </a-layout>
            </template>
            <template #author>
                <a>{{ comment.username }}</a>
            </template>
            <template #avatar>
                <a-avatar :src="comment.avatar" :alt="comment.username" />
            </template>
            <template #content>
                <div v-html="comment.content"></div>
            </template>
            <template #datetime>
                <a-tooltip :title="formatTime(comment.createTime)">
                    <span>{{ dayjs(formatTime(comment.createTime)).fromNow(true) }}</span>
                </a-tooltip>
            </template>
            <a-divider />

            <CommentChild :commentList="comment.commentChildList" :getCommentListVOAll="getCommentListVOALL"
                v-if="comment.commentChildList != null">
            </CommentChild>
            <!-- 投诉框 -->
            <a-modal v-model:open="visible" title="我要举报" ok-text="举报" cancel-text="取消"
                @ok="onOk(comment.userId, comment.id)">
                <a-form ref="formRef" :model="formData" layout="vertical" name="form_in_modal" :rules="rules">
                    <a-form-item name="complainContent" label="举报原因">
                        <a-textarea v-model:value="formData.complainContent" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </a-comment>

    </div>
</template>

<script setup lang="ts">
import CommentChild from '@/components/commentChild/index.vue';
import { ExclamationCircleOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons-vue';
import { createVNode, onBeforeUnmount, onMounted, reactive, ref, shallowRef, type UnwrapRef } from 'vue';
import type { IEditorConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { type CommentListVO, type CommentAddRequest, type CommentDeleteRequest } from '@/api/commment/type';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { message, type FormInstance, Modal } from 'ant-design-vue';
import { addComment, deleteComment } from '@/api/commment';
import { addPraise, deletePraise } from '@/api/praise';
import { BarsOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { ComplainAddRequest } from '@/api/complain/type';
import { addComplain } from '@/api/complain';
import useUserStore from '@/store/modules/user'
import pinia from '@/store';
import 'dayjs/locale/zh-cn'; // 引入简体中文

//评论列表数据
let props = defineProps({
    commentList: {
        type: Array,//接受的数据类型
        default: [],//接受默认数据
    },
    getCommentListVOAll: {
        type: Function,
        default: (articleId: number) => { }
    }
})

const loginUserId = ref(0)

//获取登录信息
onMounted(() => {
    const userStore = useUserStore(pinia)
    if (userStore.userId != null && userStore.userId > 0) {
        loginUserId.value = userStore.userId;
    }
});

//前一个回复框内容
const record = ref<CommentListVO>();
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
//显示回复框
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
            // console.log("测试1", record.value)
        } else {
            valueHtmlChild.value = '';
            editorRefChild.value = undefined
            record.value.showForm = false;
            comment.showForm = true;
            record.value = comment
            // console.log("测试2", record.value)
        }

    }
}

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

//刷新评论列表
const getCommentListVOALL = (articleId: number) => {
    props.getCommentListVOAll(articleId)
}

//子评论表单数据
const formState: UnwrapRef<CommentAddRequest> = reactive({
    content: '',//内容
    parentId: undefined,//父评论Id
    topId: undefined,//顶层评论id
    articleId: undefined,//被评论文章id
    isTop: 1,//是否为顶层评论（0：是，1：不是）
});
// 提交表单的方法  
const submitForm = async (parentId: number, topId: number, articleId: number) => {
    // //获取富文本中的数据
    formState.content = valueHtmlChild.value;
    formState.parentId = parentId;
    formState.topId = topId
    formState.articleId = articleId;
    console.log(formState);
    const res = await addComment(formState)
    if (res.code == 0 && res.data) {
        message.success("发送评论成功")
        formState.content = '';
        //加载评论区
        getCommentListVOALL(articleId)
        valueHtmlChild.value = '';
    } else {
        message.error(res.message)
    }
};

dayjs.extend(relativeTime);
dayjs.locale('zh-cn'); // 设置为简体中文

//点赞
const PraiseRequest = {
    id: 0,
    type: 1
}
//点赞文章
const doPraise = async (id: number, articleId: number) => {
    PraiseRequest.id = id
    const res = await addPraise(PraiseRequest);
    if (res.code == 0 && res.data) {
        getCommentListVOALL(articleId)
    } else {
        message.error(res.message)
    }
}
//取消点赞
const unDoPraise = async (id: number, articleId: number) => {
    PraiseRequest.id = id
    const res = await deletePraise(PraiseRequest);
    if (res.code == 0 && res.data) {
        getCommentListVOALL(articleId)
    } else {
        message.error(res.message)
    }
}

//投诉
const formRef = ref<FormInstance>();
const visible = ref(false);

//表单数据
const formData: UnwrapRef<ComplainAddRequest> = reactive({
    complainId: 0,
    type: 1,
    complainContent: '',//投诉内容
    isComplainUserId: 0 //被投诉用户的id
});
const rules: Record<string, Rule[]> = {
    complainContent: [
        { required: true, message: '请输入投诉原因', trigger: 'change' }
    ],
};
//投诉
const onOk = async (userId: number, commentId: number) => {
    console.log(formData.complainContent)
    if (formData.complainContent == null || formData.complainContent == '') {
        return message.error("请输入投诉原因")
    }
    formData.complainId = commentId;
    formData.isComplainUserId = userId;
    const res = await addComplain(formData);
    if (res.code == 0) {
        message.success("投诉成功");
        formData.complainContent = '';
        visible.value = false;
    } else {
        message.error(res.message);
    }
}
const commentDeleteRequest = ref<CommentDeleteRequest>({
    commentId: 0,
    userId: 0,
}
)
//删除评论
const showDeleteConfirm = (commentId: number, userId: number, articleId: number) => {
    Modal.confirm({
        title: '确定删除该评论吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '如果该评论有子评论也将会被一起删除',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
            //删除评论
            commentDeleteRequest.value.userId = userId;
            commentDeleteRequest.value.commentId = commentId;
            const res = await deleteComment(commentDeleteRequest.value);
            if (res.code == 0 && res.data) {
                message.success("删除该评论成功")
                getCommentListVOALL(articleId)
            } else {
                message.error(res.message);
            }
        },
        onCancel() {
            console.log('Cancel');
        },
    });
};
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


</script>


<style scoped>
.headerStyle {
    background: white;
    padding: 0;
}

.contentStyle {
    background: white;
}
</style>