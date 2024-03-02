<template>
    <div>
        <a-table sticky :columns="columns" :data-source="data" :pagination="rolePage" :scroll="{ x: 1500 }" row-key="id"
            childrenColumnName="childerWordTypeList">
            <template #id="{ text, record, index }">
                {{ index + 1 }}
            </template>
            <!-- 搜索 -->
            <template #title>
                <a-row>
                    <span style="font-size: 25px; font-weight: bold; sans-serif;">标签管理</span>
                    <!-- 搜索栏 -->
                    <a-form layout="inline" style="margin-left: 30px;padding-top: 10px;" :model="formState">
                        <a-form-item label="标签名">
                            <a-input placeholder="请输入标签名" v-model:value="formState.tagName"></a-input>
                        </a-form-item>
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
                    <!-- 新增标签信息 -->
                    <div style="padding-top: 10px;margin-left: 100px;">
                        <a-button type="primary" @click="showAdd = true">新增</a-button>
                        <a-modal v-model:open="showAdd" title="新增标签" ok-text="确认" cancel-text="取消" @ok="onAdd">
                            <a-form ref="formRef2" :model="formAdd" layout="vertical" name="form_in_modal">
                                <a-form-item name="tagName" label="标签名:"
                                    :rules="[{ required: true, message: '请输入标签名' }]">
                                    <a-input v-model:value="formAdd.tagName" />
                                </a-form-item>

                            </a-form>
                        </a-modal>
                    </div>

                </a-row>
                <!-- 表格 -->
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'createTime'">
                    {{ formatTime(record.createTime) }}
                </template>
                <template v-if="column.key === 'updateTime'">
                    {{ formatTime(record.updateTime) }}
                </template>
                <!-- 操作 -->
                <template v-if="column.key === 'operation'">
                    <a-space warp>
                        <a-tooltip title="修改按钮">
                            <a-button type="primary" size="small" @click="onUpdate(record)">
                                <template #icon>
                                    <FormOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-popconfirm title="确认删除?" @confirm="onDelete(record.id)">
                            <a-tooltip title="删除按钮">
                                <a-button type="primary" size="small" danger>
                                    <template #icon>
                                        <DeleteOutlined />
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>

    <!-- 修改 -->
    <div>
        <a-modal v-model:open="visible" title="修改标签信息" ok-text="确认" cancel-text="取消" @ok="onOk">
            <a-form ref="formRef" :model="formData" layout="vertical" name="form_in_modal">
                <a-form-item label="标签名" name="modifier" class="collection-create-form_last-form-item">
                    <a-input v-model:value="formData.tagName" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>



<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue';
import {
    DeleteOutlined, FormOutlined, SearchOutlined, CloseOutlined
} from '@ant-design/icons-vue';
import { onMounted, reactive, ref, toRaw, type UnwrapRef } from 'vue';
import type { TagListRequest, TagListVO, TagUpdateRequest } from '@/api/tag/type';
import { addTag, deleteTag, getTagListPage, updateTag } from '@/api/tag';



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
        title: '标签名',
        dataIndex: 'tagName',
        key: 'tagName',
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
let data = ref<TagListVO[]>([]);

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
        getTagListAll(formState)
    },
    //页数改变是触发
    onChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.current = current;
        getTagListAll(formState)
    }
});

//列表查询的参数
const tagList = reactive({
    tagName: '',
    current: rolePage.current,
    pageSize: rolePage.pageSize,
})

//向后台发送请求获取用户列表信息
const getTagListAll = async (tagListRequest: TagListRequest) => {
    try {
        const response = await getTagListPage(tagListRequest);
        if (response.code === 0) {
            // 接受数据成功  
            data.value = response.data?.rows as [];
            rolePage.total = response.data?.total as number
        } else {
            // 处理错误  
            message.error(response.message || '获取单词类型列表失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('请求单词类型列表时发生错误');
        console.error(error);
    }
};

//组件挂载完毕：发一次请求获取数据
onMounted(() => {
    getTagListAll(tagList);
})

//重置按钮
const reset = () => {
    formState.tagName = '';
    formState.current = 1;
    formState.pageSize = rolePage.pageSize;
    rolePage.current = 1;
    getTagListAll(formState);
}

//表单数据
const formState: UnwrapRef<TagListRequest> = reactive({
    tagName: '',
    current: rolePage.current,
    pageSize: rolePage.pageSize,
});

//搜索按钮
const onSubmit = () => {
    formState.current = 1;
    rolePage.current = 1;
    getTagListAll(formState)
}

//删除单词类型id
const DeleteRequest = {
    id: 0
}

//删除按钮
const onDelete = async (key: number) => {
    DeleteRequest.id = key
    //管理员删除用户信息
    try {
        const response = await deleteTag(DeleteRequest);
        if (response.code === 0 && response.data) {
            // 接受数据成功  
            message.success(response.message || '删除标签成功');
            getTagListAll(formState)
        } else {
            // 处理错误  
            message.error(response.message || '删除标签失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('删除标签数据时发生错误');
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

//需要修改的用户信息
const formData: UnwrapRef<TagUpdateRequest> = reactive({
    tagName: '',
    id: 0,
})

//修改按钮
const onUpdate = async (tagListVO: TagListVO) => {
        visible.value = true;
        formData.tagName = tagListVO.tagName as string;
        formData.id =  tagListVO.id as number;
}

const formRef = ref<FormInstance>();

//弹框中：确认修改信息
const onOk = () => {
    formRef.value
        .validateFields()
        .then(async (values: any) => {
            const res = updateTag(toRaw(formData));
            if ((await res).code == 0 && (await res).data) {
                message.success('修改成功');
                visible.value = false;
                getTagListAll(tagList);
            } else {
                message.error((await res).message);
            }
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        });
};



const formRef2 = ref<FormInstance>();
const showAdd = ref(false);
const formAdd = reactive({
    tagName: '',
});

//新增单词类型
const onAdd = () => {
    formRef2.value
        .validateFields()
        .then(async values => {

            const res = await addTag(values.tagName);
            if (res.code == 0 && res.data) {
                message.success('新增成功');
                formAdd.tagName = '';
                getTagListAll(tagList);
            } else {
                message.error(res.message);
            }
        })
        .catch(info => {
            message.error("新增失败");
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
  