<template>
    <a-card style="margin-top: 10px;">
        <div class="comment-container">
            <div style="line-height: 50px;">
                <span style="font-size: 20px; font-weight: bold;">评论区：</span>
                <div style="border: 1px solid #ccc">
                    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                        mode="default" />
                    <Editor style="width: 100%;height: 100px; overflow-y: hidden;" v-model="valueHtml"
                        :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                </div>
                <a-button type="primary" html-type="submit" style="width: 300px;" @click="submitForm">发表评论</a-button>
            </div>

            <div id="comment">
                <div id="commentMsg">
                    <div v-if="commentList.length == 0" class="head-message"><a-empty /></div>
                    <div v-else>
                        <CommentChild :commentList="commentList"></CommentChild>
                    </div>
                </div>
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, shallowRef, type UnwrapRef, watch } from 'vue';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import type { IEditorConfig } from '@wangeditor/editor';
import type { CommentAddRequest, CommentListVO } from '@/api/commment/type';
import { message } from 'ant-design-vue';
import { addComment, getCommentListVO } from '@/api/commment';
import CommentChild from '@/components/commentChild/index.vue';


const props = defineProps({
    articleId: {
        type: Number,
        required: true
    }
});

// 获取 articleId 的值
const IdRequest = reactive({
    id: 0
})

watch(() => props.articleId, (newId, oldId) => {
    // 在 articleId 变化时执行逻辑
    getCommentListVOAll(newId);
});



const commentList = ref<CommentListVO[]>([]);
//获取评论信息
const getCommentListVOAll = async (id: number) => {
    IdRequest.id = id;
    const res = await getCommentListVO(IdRequest);
    if (res.code == 0) {
        commentList.value = res.data;
    } else {
        message.error("获取评论信息失败");
    }
}

//富文本组件处理
const editorRef = shallowRef()
const valueHtml = ref('')
const toolbarConfig = {}
toolbarConfig.toolbarKeys = [
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
const editorConfig: Partial<IEditorConfig> = {
    MENU_CONF: {},
    placeholder: '请输入内容...'
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

//父评论表单数据
const formState: UnwrapRef<CommentAddRequest> = reactive({
    content: '',//内容
    parentId: undefined,//父评论Id
    topId: undefined,//顶层评论id
    articleId: undefined,//被评论文章id
    isTop: 0,//是否为顶层评论（0：是，1：不是）
});

// 提交表单的方法  
const submitForm = async () => {
    //获取富文本中的数据
    formState.content = valueHtml.value;
    formState.articleId = props.articleId;
    const res = await addComment(formState)
    if (res.code == 0 && res.data) {
        message.success("发送评论成功")
        formState.content = '';
        //加载评论区

        valueHtml.value = '';
    } else {
        message.error(res.message)
    }
};



</script>

<style scoped>
.comment-container {
    padding: 0;
}

.head-message {
    font-size: 20px;
    text-align: center;
    height: 100%;
}

#comment {
    height: 100%;
    margin-left: 50px;
}

#message_content {
    line-height: 5px;
    margin-top: 50px;
    height: 100%;
}


* {
    /deep/:where(.css-dev-only-do-not-override-1hsjdkk).ant-comment .ant-comment-inner {
        padding: 0 !important
    }
}
</style>