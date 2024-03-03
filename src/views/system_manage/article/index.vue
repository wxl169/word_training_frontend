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
                            <a-input placeholder="请输入用户账号" v-model:value="formState.userAccount"></a-input>
                        </a-form-item>
                        <!-- 内容搜索 -->
                        <a-form-item label="内容搜索">
                            <a-input placeholder="请输入需要搜索的内容" v-model:value="formState.content"></a-input>
                        </a-form-item>
                        <!-- 状态 -->
                        <a-form-item name="status" label="状态">
                            <a-select v-model:value="formState.status" placeholder="请选择文章状态">
                                <a-select-option :value=0>正常发布</a-select-option>
                                <a-select-option :value=1>整改中</a-select-option>
                                <a-select-option :value=2>整改完</a-select-option>
                                <a-select-option :value=3>已封禁</a-select-option>
                            </a-select>
                        </a-form-item>
                        <!-- 权限 -->
                        <a-form-item name="permissions" label="权限">
                            <a-select v-model:value="formState.permissions" placeholder="请选择文章权限">
                                <a-select-option :value=0>公开</a-select-option>
                                <a-select-option :value=1>私有</a-select-option>
                                <a-select-option :value=2>仅关注自己的用户</a-select-option>
                                <a-select-option :value=3>仅自己的关注用户</a-select-option>
                            </a-select>
                        </a-form-item>
                        <!-- 标签 -->
                        <a-form-item name="tag" label="请选择标签:">
                            <a-select ref="select" v-model:value="formState.tags" style="width: 200px" mode="multiple"
                                placeholder="请选择标签">
                                <a-select-option v-for="item in tagList" :value="item.tagName" :key="item.id">{{
            item.tagName }}</a-select-option>
                            </a-select>
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
                <template v-if="column.key === 'coverImage' && record.coverImage != null">
                    <img :src="record.coverImage" alt="" style="width: 50px; height: 50px;" />
                </template>
                <!-- 内容 -->

                <template v-if="column.key === 'content'">
                    <a-button @click="onSelectArticleDetail(record)">查看内容</a-button>
                </template>

                <!-- 状态 -->

                <template v-if="column.key === 'status'">
                    <a-tag color="blue" v-if="record.status === 0">正常发布</a-tag>
                    <a-tag color="f50" v-if="record.status === 1">整改中</a-tag>
                    <a-tag color="pink" v-if="record.status === 2">整改完</a-tag>
                    <a-tag color="red" v-if="record.status === 3">已封禁</a-tag>
                </template>
                <!-- 权限 -->

                <template v-if="column.key === 'permissions'">
                    <a-tag color="orange" v-if="record.permissions === 0">公开</a-tag>
                    <a-tag color="#2db7f5" v-if="record.permissions === 1">私有</a-tag>
                    <a-tag color="#f50" v-if="record.permissions === 2"> 仅关注自己的用户</a-tag>
                    <a-tag color="pink" v-if="record.permissions === 3"> 仅自己关注的用户</a-tag>
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
                        <!-- 查看详情 -->
                        <a-tooltip title="文章回稿">
                            <a-button type="primary" size="small" @click="onReply(record)">
                                <template #icon>
                                    <ExceptionOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>

                        <!-- 封禁文章 -->
                        <div>
                            <div v-if="record.status == 0 || record.status == 1">
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
                <a-form-item label="审核意见" name="modifier" >
                    <a-input v-model:value="formUpdate.reviewOpinions" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>



<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue';
import {
    SearchOutlined, CloseOutlined, ExceptionOutlined, UnlockOutlined, LockOutlined
} from '@ant-design/icons-vue';
import { onMounted, reactive, ref, toRaw, type UnwrapRef } from 'vue';
import type { ArticleListRequest, ArticleListVO, ArticleUpdateReviewOpinionsRequest } from '@/api/article/type';
import { selectArticleById, selectArticleListVO, updateArticleReviewOpinions, updateArticleStatus } from '@/api/article';
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
    reviewOpinions:''
})
const onReply = async (articleListVO:ArticleListVO) => {
    reply.value = true;
    IdRequest.id = articleListVO.id;
    const res = await selectArticleById(IdRequest)
    if(res.code == 0){
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
            if(res.code == 0 && res.data){
                message.success("回稿完成，已通知用户修改内容")
                reply.value = false;
                getArticleList(formState)
            }else{
                message.error(res.message)
            }
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        });
};
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