<template>
    <div style="margin-top: 50px;">
        <a-comment id="message_content" v-for="comment in props.commentList" :key="comment.id"
            style="margin-top: 20px;">
            <template #actions>
                <span key="comment-nested-reply-to" @click="showReplyForm(comment)">回复</span>
                <div v-if="comment.showForm">
                    <div style="border: 1px solid #ccc">
                        <Toolbar style="border-bottom: 1px solid #ccc;width: 800px;height: 50px;"
                            :editor="editorRefChild" :defaultConfig="toolbarConfigChild" mode="default" />
                        <Editor style="width: 800px;height: 150px; overflow-y: hidden;" v-model="valueHtmlChild"
                            :defaultConfig="editorConfigChild" mode="default" @onCreated="handleCreatedChild" />
                    </div>
                    <a-button type="primary" html-type="submit" style="width: 100px;margin-top: 10px;"
                        @click="submitForm">发表评论</a-button>
                </div>

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
            <CommentChild :commentList="comment.commentChild" v-if="comment.commentChild != null"> </CommentChild>
        </a-comment>
    </div>
</template>

<script setup lang="ts">
import CommentChild from '@/components/commentChild/index.vue';
import { onBeforeUnmount, ref, shallowRef } from 'vue';
import type { IEditorConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { CommentListVO } from '@/api/commment/type';

const props = defineProps(["commentList"]);

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

// 提交表单的方法  
const submitForm = async () => {
    //获取富文本中的数据
    // formState.content = valueHtml.value;
    // formState.articleId = props.articleId;
    // const res = await addComment(formState)
    // if (res.code == 0 && res.data) {
    //     message.success("发送评论成功")
    //     formState.content = '';
    //     //加载评论区

    //     valueHtml.value = '';
    // } else {
    //     message.error(res.message)
    // }
};


</script>


<style scoped></style>