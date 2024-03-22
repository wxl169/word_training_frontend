<template>
    <div>
        <a-table sticky :columns="columns" :data-source="data" :pagination="rolePage" :scroll="{ x: 1500 }"
            row-key="id">
            <template #id="{ text, record, index }">
                {{ index + 1 }}
            </template>
            <!-- 搜索栏 -->

            <template #title>
                <a-row>
                    <span style="font-size: 25px; font-weight: bold;" sans-serif>文章管理</span>
                    <!-- 搜索栏 -->
                    <a-form layout="inline" style="margin-left: 30px;padding-top: 10px;" :model="formState">
                        <!-- 用户账号 -->
                        <a-form-item label="用户账号">
                            <a-tooltip>
                                <template #title>请输入用户账号</template>
                                <a-input placeholder="请输入用户账号" v-model:value="formState.userAccount"
                                    style="width: 150px;"></a-input>
                            </a-tooltip>
                        </a-form-item>
                        <!-- 内容搜索 -->
                        <a-form-item label="内容搜索">
                            <a-tooltip>
                                <template #title>请输入需要搜索的内容</template>
                                <a-input placeholder="请输入需要搜索的内容" v-model:value="formState.content"></a-input>
                            </a-tooltip>
                        </a-form-item>
                        <!-- 状态 -->
                        <a-form-item name="status" label="状态">
                            <a-tooltip>
                                <template #title>请选择文章状态</template>
                                <a-select v-model:value="formState.status" placeholder="请选择文章状态"
                                    style="text-align: center;width: 100px;">
                                    <a-select-option :value=0>正常发布</a-select-option>
                                    <a-select-option :value=1>审核中</a-select-option>
                                    <a-select-option :value=2>整改中</a-select-option>
                                    <a-select-option :value=4>已封禁</a-select-option>
                                </a-select>
                            </a-tooltip>
                        </a-form-item>
                        <!-- 权限 -->
                        <a-form-item name="permissions" label="权限">
                            <a-tooltip>
                                <template #title>请选择文章权限</template>
                                <a-select v-model:value="formState.permissions" placeholder="请选择文章权限"
                                    style="text-align: center">
                                    <a-select-option :value=0>公开</a-select-option>
                                    <a-select-option :value=1>私有</a-select-option>
                                    <a-select-option :value=2>仅关注自己的用户</a-select-option>
                                </a-select>
                            </a-tooltip>
                        </a-form-item>
                        <!-- 标签 -->
                        <a-form-item name="tag" label="请选择标签:">
                            <a-tooltip>
                                <template #title>请选择标签</template>
                                <a-select ref="select" v-model:value="formState.tags" style="width: 150px"
                                    mode="multiple" placeholder="请选择标签">
                                    <a-select-option v-for="item in tagList" :value="item.tagName" :key="item.id"
                                        style="text-align: center">{{
            item.tagName }}</a-select-option>
                                </a-select>
                            </a-tooltip>
                        </a-form-item>
                        <!-- 操作 -->
                        <a-form-item>
                            <a-button @click="onSubmit">
                                <template #icon>
                                    <SearchOutlined />
                                </template>
                                搜索
                            </a-button>
                            <a-button style="margin-left: 5px;" danger @click="reset">

                                <template #icon>
                                    <CloseOutlined />
                                </template>
                                重置
                            </a-button>
                        </a-form-item>
                    </a-form>

                </a-row>
                <!-- 表格 -->
            </template>

            <template #bodyCell="{ column, record }">
                <!-- 封面 -->
                <template v-if="column.key === 'coverImage'">
                    <div v-if="record.coverImage == null">
                        <a-image src="#" style="width: 50px; height: 50px;"
                            fallback="data:image/png;base64,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" />
                    </div>
                    <div v-else>
                        <a-image :src="record.coverImage" style="width: 50px; height: 50px;"
                            fallback="data:image/png;base64,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" />
                    </div>
                </template>
                <!-- 内容 -->

                <template v-if="column.key === 'content'">
                    <a-button @click="onSelectArticleDetail(record)">查看内容</a-button>
                </template>

                <!-- 状态 -->
                <template v-if="column.key === 'status'">
                    <a-tag color="green" v-if="record.status === 0">正常发布</a-tag>
                    <a-tag color="warning" v-if="record.status === 1">审核中</a-tag>
                    <a-tag color="#f50" v-if="record.status === 2">整改中</a-tag>
                    <a-tag color="red" v-if="record.status === 4">已封禁</a-tag>
                </template>
                <!-- 权限 -->
                <template v-if="column.key === 'permissions'">
                    <a-tag color="blue" v-if="record.permissions === 0">公开</a-tag>
                    <a-tag color="#2db7f5" v-if="record.permissions === 1">私有</a-tag>
                    <a-tag color="#f50" v-if="record.permissions === 2"> 仅关注自己的用户</a-tag>
                </template>
                <!-- 标签 -->

                <template v-if="column.key === 'tags'">
                    <a-space :size="[1, 1]" wrap>
                        <template v-for="item in record.tags" :key="item">
                            <a-tag color="blue">{{ item }}</a-tag>
                        </template>
                    </a-space>
                </template>
                <!-- 修改时间 -->

                <template v-if="column.key === 'updateTime'">
                    {{ formatTime(record.updateTime) }}
                </template>
                <!-- 创建时间 -->

                <template v-if="column.key === 'createTime'">
                    {{ formatTime(record.createTime) }}
                </template>
                <!-- 操作 -->

                <template v-if="column.key === 'operation'">
                    <a-space warp>
                         <!-- 审核通过 -->
                         <a-tooltip title="审核通过">
                            <a-button  size="small" @click="toPass(record.id)" v-if="record.status == 1" style=" border: 1px solid transparent;">
                                <template #icon>
                                    <CheckCircleTwoTone style="font-size: 20px;margin-top: 5px;"/>
                                </template>
                            </a-button>
                        </a-tooltip>
                        <!-- 文章回稿 -->
                        <a-tooltip title="文章回稿">
                            <a-button type="primary" size="small" @click="onReply(record)"  v-if="record.status == 1 || record.status == 0 || record.status == 2">
                                <template #icon>
                                    <ExceptionOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>

                        <!-- 封禁文章 -->
                        <div>
                            <div v-if="record.status == 0 || record.status == 1 || record.status == 2">
                                <a-popconfirm title="确认封禁文章?" @confirm="onUpdateStatus(record.id)">
                                    <a-tooltip title="封禁文章">
                                        <a-button type="primary" size="small" danger>

                                            <template #icon>
                                                <LockOutlined />
                                            </template>
                                        </a-button>
                                    </a-tooltip>
                                </a-popconfirm>
                            </div>
                            <div v-else>
                                <a-popconfirm title="确认解禁文章?" @confirm="onUpdateStatus(record.id)">
                                    <a-tooltip title="解禁文章">
                                        <a-button type="primary" size="small"
                                            style="color: white;background-color: greenyellow;">

                                            <template #icon>
                                                <UnlockOutlined />
                                            </template>
                                        </a-button>
                                    </a-tooltip>
                                </a-popconfirm>
                            </div>
                        </div>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>


    <!-- 查看文章详情 -->
    <div>
        <a-modal v-model:open="visible" ok-text="确认" cancel-text="取消" @ok="onOk" style="width: 80%;" :footer="null">
            <div class="w-e-text">
                <div v-html="formData.content">
                </div>
            </div>
        </a-modal>
    </div>

    <!-- 文章回稿审核意见 -->
    <div>
        <a-modal v-model:open="reply" ok-text="确认" cancel-text="关闭" @ok="doReply()" title="文章回稿审核意见">
            <a-form ref="formRef" :model="formUpdate" layout="vertical" name="form_in_modal">
                <a-form-item label="审核修改意见" name="reviewOpinions" :rules="[{ required: true, message: '请输入审核修改意见!' }]">
                    <a-input v-model:value="formUpdate.reviewOpinions" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>



<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue';
import {
    SearchOutlined, CloseOutlined, ExceptionOutlined, UnlockOutlined, LockOutlined,CheckCircleTwoTone
} from '@ant-design/icons-vue';
import { onMounted, reactive, ref, toRaw, type UnwrapRef } from 'vue';
import type { ArticleListRequest, ArticleListVO, ArticleUpdateReviewOpinionsRequest } from '@/api/article/type';
import { selectArticleById, selectArticleListVO, updateArticleReviewOpinions, updateArticleStatus, updateArticleStatusPass } from '@/api/article';
import type { TagVO } from '@/api/tag/type';
import { getTagVOListAll } from '@/api/tag';

//表格字段
const columns = [
    {
        title: '序号',
        width: 100,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        customRender: ({ text, record, index }) => index + 1,
    },
    {
        title: '发布人',
        width: 100,
        dataIndex: 'userAccount',
        key: 'userAccount',
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 150,
        ellipsis: true,
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: 150,
        ellipsis: true,
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        width: 150,
        ellipsis: true,
    },
    {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        width: 100,
        ellipsis: true,
    },
    {
        title: '封面图',
        dataIndex: 'coverImage',
        key: 'coverImage',
        width: 100,
        ellipsis: true,
    },
    {
        title: '浏览量',
        dataIndex: 'visitNumber',
        key: 'visitNumber',
        width: 100,
        ellipsis: true,
        sorter: (a, b) => a.visitNumber - b.visitNumber,
    },
    {
        title: '点赞数',
        dataIndex: 'praiseNumber',
        key: 'praiseNumber',
        width: 140,
        ellipsis: true,
        sorter: (a, b) => a.praiseNumber - b.praiseNumber,
    },
    {
        title: '评论数',
        dataIndex: 'commentNumber',
        key: 'commentNumber',
        width: 130,
        ellipsis: true,
        sorter: (a, b) => a.commentNumber - b.commentNumber,
    },
    {
        title: '收藏数',
        dataIndex: 'collectionNumber',
        key: 'collectionNumber',
        width: 150,
        ellipsis: true,
        sorter: (a, b) => a.commentNumber - b.commentNumber,
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        ellipsis: true,
    },
    {
        title: '权限',
        dataIndex: 'permissions',
        key: 'permissions',
        width: 150,
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
        ellipsis: true,
    },
    {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 180,
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
    },
];

//表格数据
let data = ref<ArticleListVO[]>([]);

//分页
const rolePage = reactive({
    total: 0,
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15', '20'],
    showTotal: (total: number) => `共有${total}条数据`,
    //页容量改变是触发
    onShowSizeChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.pageSize = pageSize;
        getArticleList(formState)
    },
    //页数改变是触发
    onChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.current = current;
        getArticleList(formState)
    }
});

//列表查询的参数
const articleListRequest = reactive({
    userAccount: '',
    content: '',
    tags: [],
    status: undefined,
    permissions: undefined,
    current: rolePage.current,
    pageSize: rolePage.pageSize,
})

//向后台发送请求获取文章列表信息
const getArticleList = async (articleListRequest: ArticleListRequest) => {
    try {
        const response = await selectArticleListVO(articleListRequest);
        if (response.code === 0) {
            // 接受数据成功  
            data.value = response.data?.rows as [];
            rolePage.total = response.data?.total as number
        } else {
            // 处理错误  
            message.error(response.message || '获取文章列表失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('请求文章列表时发生错误');
        console.error(error);
    }
};

//组件挂载完毕：发一次请求获取数据
onMounted(() => {
    getTagListAll();
    getArticleList(articleListRequest);
})

const tagList = ref<TagVO[]>([]);
//获取所有标签
const getTagListAll = async () => {
    const res = await getTagVOListAll();
    if (res.code == 0) {
        tagList.value = res.data
    }
}

//重置按钮
const reset = () => {
    formState.userAccount = '';
    formState.status = undefined;
    formState.permissions = undefined;
    formState.tags = [];
    formState.current = 1;
    formState.pageSize = rolePage.pageSize;
    rolePage.current = 1;
    getArticleList(formState);
}

//表单数据
const formState: UnwrapRef<ArticleListRequest> = reactive({
    userAccount: '',
    content: '',
    status: undefined,
    permissions: undefined,
    tags: [],
    current: rolePage.current,
    pageSize: rolePage.pageSize,
});

//搜索按钮
const onSubmit = () => {
    formState.current = 1;
    rolePage.current = 1;
    getArticleList(formState)
}

//修改文章状态参数
const IdRequest = {
    id: 0,
}

//修改文章状态
const onUpdateStatus = async (key: number) => {
    IdRequest.id = key
    //管理员修改文章的状态信息
    try {
        const response = await updateArticleStatus(IdRequest);
        if (response.code === 0 && response.data) {
            // 接受数据成功  
            message.success('修改文章状态成功');
            getArticleList(formState)
        } else {
            // 处理错误  
            message.error(response.message || '修改文章状态失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('修改文章状态数据时发生错误');
        console.error(error);
    }
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


//是否弹出修改用户信息弹框
const visible = ref(false);
const formData = ref();
//查看详情按钮
const onSelectArticleDetail = (articleListVo: ArticleListVO) => {
    visible.value = true;
    formData.value = articleListVo;
}
//弹框中：确认修改信息
const onOk = () => {
    visible.value = false;
};

//文章回稿审核意见信息弹框
const reply = ref(false);
//需要修改的参数
const formUpdate: UnwrapRef<ArticleUpdateReviewOpinionsRequest> = reactive({
    id: 0,
    reviewOpinions: ''
})
const onReply = async (articleListVO: ArticleListVO) => {
    reply.value = true;
    IdRequest.id = articleListVO.id;
    const res = await selectArticleById(IdRequest)
    if (res.code == 0) {
        formUpdate.id = res.data?.id as number;
        formUpdate.reviewOpinions = res.data?.reviewOpinions as string;
    }
}
const formRef = ref<FormInstance>();

//弹框中：确认修改信息
const doReply = () => {
    formRef.value
        .validateFields()
        .then(async (values: any) => {
            const res = await updateArticleReviewOpinions(toRaw(formUpdate))
            if (res.code == 0 && res.data) {
                message.success("回稿完成，已通知用户修改内容")
                reply.value = false;
                getArticleList(formState)
            } else {
                message.error(res.message)
            }
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        });
};

//审核通过
const toPass = async (id: number) =>{
    IdRequest.id = id
    const res = await updateArticleStatusPass(IdRequest)
    if(res.code == 0 && res.data){
        message.success("审核通过")
        getArticleList(formState)
    }else{
        message.error(res.message)
    }
}

</script>



<style scoped>
#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
    background: #fafafa;
}

[data-theme='dark'] #components-table-demo-summary tfoot th,
[data-theme='dark'] #components-table-demo-summary tfoot td {
    background: #1d1d1d;
}
</style>