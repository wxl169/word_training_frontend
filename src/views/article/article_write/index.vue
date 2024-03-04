<template>
    <div style=" padding: 0px">
        <a-card :bordered="false" style="width: 100%;">
            <template #title>
                <div class="container">
                    <router-link :to="{ path: '/article/home' }">
                        <ArrowLeftOutlined style="font-size: 50px; color: black;" />
                    </router-link>
                    <span class="title">新建文章</span>
                </div>
            </template>
            <div>
                <a-form :model="formState" :rules="rules" ref="formRef">
                    <!-- 标题 -->
                    <a-form-item name="title">

                        <template #label>
                            <span style="font-size: 20px;">标题</span>
                        </template>
                        <a-input v-model:value="formState.title" placeholder="请输入文章标题（最多不超过50字）" />
                    </a-form-item>
                    <!-- 描述 -->
                    <a-form-item name="description">

                        <template #label>
                            <span style="font-size: 20px;">描述</span>
                        </template>
                        <a-input v-model:value="formState.description" placeholder="请输入文章描述（最多不超过200字）" />
                    </a-form-item>
                    <!-- 内容 -->
                    <a-form-item name="content">

                        <template #label>
                            <span style="font-size: 20px;">内容</span>
                        </template>
                        <div style="border: 1px solid #ccc">
                            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
                                :defaultConfig="toolbarConfig" mode="default" />
                            <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml"
                                :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                        </div>
                    </a-form-item>
                    <!-- 标签 -->
                    <a-form-item name="tag">

                        <template #label>
                            <span style="font-size: 20px;">标签</span>
                        </template>
                        <a-select ref="select" v-model:value="formState.tags" style="width: 250px" mode="multiple"
                            placeholder="请选择标签">
                            <a-select-option v-for="item in tagList" :value="item.tagName" :key="item.id">{{
            item.tagName }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <!-- 封面 -->
                    <a-form-item name="image">
                        <template #label>
                            <span style="font-size: 20px;">封面</span>
                        </template>
                        <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card"
                            class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload"
                            @change="handleChange" :maxCount="1" :customRequest="uploadArticleImage">
                            <img v-if="formState.coverImage" :src="formState.coverImage" alt="avatar"
                                style="width: 100px;height: 100px;" />
                            <div v-else>
                                <loading-outlined v-if="loading"></loading-outlined>
                                <plus-outlined v-else></plus-outlined>
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                    <!-- 访问权限 -->
                    <a-form-item name="permissions">

                        <template #label>
                            <span style="font-size: 20px;">访问权限</span>
                        </template>
                        <a-radio-group v-model:value="formState.permissions">
                            <a-radio :value=0>公开</a-radio>
                            <a-radio :value=1>私有</a-radio>
                            <a-radio :value=2>仅关注自己的用户</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-button type="primary" html-type="submit" style="width: 300px;"
                            @click="submitForm">提交</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { addArticle, uploadImage } from '@/api/article';
import type { ArticleAddRequest } from '@/api/article/type';
import { getTagVOListAll } from '@/api/tag';
import type { TagVO } from '@/api/tag/type';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { message, type UploadChangeParam, type UploadProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { onMounted, reactive, ref, shallowRef, toRaw, onBeforeUnmount } from 'vue';
import type { UnwrapRef } from 'vue';
import type { IEditorConfig } from '@wangeditor/editor';

onMounted(() => {
    //获取所有标签
    getTagListAll();
})

//表单数据检验
const rules: Record<string, Rule[]> = {
    title: [
        { required: true, message: '请输入文章标题名', trigger: 'change' },
        { min: 3, max: 50, message: '标题长度限制在3到50字', trigger: 'blur' },
    ],
    description: [{ required: true, message: '请输入文章描述', trigger: 'change' },
    { min: 3, max: 200, message: '描述信息长度限制在3到200字', trigger: 'blur' }],
    permissions: [{ required: true, message: '请选择访问权限', trigger: 'change' }],
};

//表单数据
const formState: UnwrapRef<ArticleAddRequest> = reactive({
    title: '',//标题
    content: '',//内容
    description: '',//描述
    tags: [],//标签
    coverImage: '',//封面
    permissions: 0,//权限
});

//富文本组件处理
const editorRef = shallowRef()
const valueHtml = ref('')
const toolbarConfig = {}
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

//富文本上传图片
editorConfig.MENU_CONF['uploadImage'] = {
    async customUpload(file, insertFn) {
        const update = handleFileChange(file)
        if (update) {
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await uploadImage(formData);
            if (res.code === 0) {
                insertFn(res.data, "内容图", res.data);
            } else {
                message.error("图片上传失败，请重试");
            }
        }
    },
    timeout: 5 * 1000, // 5 秒
}


const formRef = ref();
// 提交表单的方法  
const submitForm = async () => {
    formRef.value
        .validate()
        .then(async () => {
            //获取富文本中的数据
            formState.content = valueHtml.value;

            const res = await addArticle(formState)
            if (res.code == 0 && res.data) {
                message.success("发布文章成功")
                formState.content = '';
                const editor = editorRef.value
                if (editor == null) return
                editor.destroy()
                formState.coverImage = '';
                formState.tags = [];
                formState.description = '';
                formState.permissions = 0;
                formState.title = '';
            } else {
                message.error(res.message)
            }
        })
        .catch(error => {
            console.log('error', error);
        });
};



const tagList = ref<TagVO[]>([]);
//获取所有标签
const getTagListAll = async () => {
    const res = await getTagVOListAll();
    if (res.code == 0) {
        tagList.value = res.data
    }
}
//上传图片
function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
}

const fileList = ref([]);
const loading = ref<boolean>(false);

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
        loading.value = true;
        return;
    }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url: string) => {
            formState.coverImage = base64Url;
            loading.value = false;
        });
    }
    if (info.file.status === 'error') {
        loading.value = false;
        message.error('upload error');
    }
};
//验证图片是否符合格式要求
const handleFileChange = (file: File) => {
    // 文件上传前的处理逻辑，例如限制文件类型和大小
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG/GIF 格式的图片');
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小不能超过 2MB');
        return false;
    }
    return true;
};
//上传文件前，检查文件是否符合要求
const beforeUpload = (file: UploadProps['fileList'][number]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
        message.error('请上传png、gif、jpg格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小最大不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
//上传图片
const uploadArticleImage = async (file: UploadProps['fileList'][number]) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file.file); // 注意这里的 'avatar' 与后端接口的参数名对应
        const response = await uploadImage(formData);
        if (response.code == 0) {
            formState.coverImage = response.data as string
        } else {
            message.error(response.message)
        }
    } catch (error) {
        message.error("上传图片失败")
    }
};
</script>



<style scoped>
.container {
    display: flex;
    align-items: center;
    /* 设置容器的高度为视窗的高度 */
}

.title {
    font-size: 30px;
    text-align: center;
    margin-left: 40%;
    /* 修改为左边距 */
}
</style>
