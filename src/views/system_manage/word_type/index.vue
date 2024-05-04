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
                    <span style="font-size: 25px; font-weight: bold; sans-serif;">单词类型管理</span>
                    <!-- 搜索栏 -->
                    <a-form layout="inline" style="margin-left: 30px;padding-top: 10px;" :model="formState">
                        <a-form-item label="单词类型名">
                            <a-input placeholder="请输入单词类型名" v-model:value="formState.typeName"></a-input>
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
                    <!-- 新增单词类型信息 -->
                    <div style="padding-top: 10px;margin-left: 100px;">
                        <a-button type="primary" @click="showAdd = true">新增</a-button>
                        <a-modal v-model:open="showAdd" title="新增单词类型" ok-text="确认" cancel-text="取消" @ok="onAdd">
                            <a-form ref="formRef2" :model="formAdd" layout="vertical" name="form_in_modal">
                                <a-form-item name="typeName" label="单词类型名:"
                                    :rules="[{ required: true, message: '请输入单词类型名' }]">
                                    <a-input v-model:value="formAdd.typeName" />
                                </a-form-item>
                                <a-form-item name="isGroupName" label="是否为类型组:">
                                    <a-radio-group v-model:value="formAdd.isGroupName">
                                        <a-radio :value="0">不是</a-radio>
                                        <a-radio :value="1">是</a-radio>
                                    </a-radio-group>
                                </a-form-item>
                                <a-form-item name="id" label="请选择类型组:" v-if="formAdd.isGroupName == 0"
                                    :rules="[{ required: true, message: '请输入单词类型组' }]">
                                    <a-select ref="select" v-model:value="formAdd.id" style="width: 120px"
                                        placeholder="请选择类型组">
                                        <a-select-option v-for="item in wordTypeGroup" :value="item.id" :key="item.id">{{
                                            item.typeGroupName }}</a-select-option>
                                    </a-select>
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
        <a-modal v-model:open="visible" title="修改单词类型信息" ok-text="确认" cancel-text="取消" @ok="onOk">
            <a-form ref="formRef" :model="formData" layout="vertical" name="form_in_modal">
                <a-form-item label="单词类型名" name="modifier" class="collection-create-form_last-form-item">
                    <a-input v-model:value="formData.typeName" />
                </a-form-item>
                <a-form-item name="isGroupName" label="是否为类型组:" >
                    <a-radio-group v-model:value="formData.isGroupName">
                        <a-radio :value="0">不是</a-radio>
                        <a-radio :value="1">是</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item name="id" label="请选择类型组:" v-if="formData.isGroupName == 0"
                    :rules="[{ required: true, message: '请输入单词类型组' }]">
                    <a-select ref="select" v-model:value="formData.typeGroupId" style="width: 120px" placeholder="请选择类型组">
                        <a-select-option v-for="item in wordTypeGroup" :value="item.id" :key="item.id">{{
                            item.typeGroupName }}</a-select-option>
                    </a-select>
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
import { getWordTypeList, deleteWordType, updateWordType, addWordType, getWordTypeGroupAll, getWordTypeByOne } from '@/api/word/word_type/index';
import type { WordTypeListRequest, DeleteRequest, WordTypeUpdateRequest, WordTypeAddRequest, WordTypeListAllVO, WordTypeVO } from '@/api/word/word_type/type';


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
        title: '单词类型名',
        dataIndex: 'typeName',
        key: 'typeName',
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
let data = ref<WordTypeListAllVO[]>([]);

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
        getWordTypeListAll(formState)
    },
    //页数改变是触发
    onChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.current = current;
        getWordTypeListAll(formState)
    }
});

//列表查询的参数
const wordTypeList = reactive({
    typeName: '',
    current: rolePage.current,
    pageSize: rolePage.pageSize,
})

//向后台发送请求获取单词类型列表信息
const getWordTypeListAll = async (wordTypeListRequest: WordTypeListRequest) => {
    try {
        const response = await getWordTypeList(wordTypeListRequest);
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
    getWordTypeListAll(wordTypeList);
    //获取所有类型组
    getWordTypeGroupAlls();
})

//重置按钮
const reset = () => {
    formState.typeName = '';
    formState.current = 1;
    formState.pageSize = rolePage.pageSize;
    rolePage.current = 1;
    getWordTypeListAll(formState);
}

//表单数据
const formState: UnwrapRef<WordTypeListRequest> = reactive({
    typeName: '',
    current: rolePage.current,
    pageSize: rolePage.pageSize,
});

//搜索按钮
const onSubmit = () => {
    formState.current = 1;
    rolePage.current = 1;
    getWordTypeListAll(formState)
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
        const response = await deleteWordType(DeleteRequest);
        if (response.code === 0 && response.data) {
            // 接受数据成功  
            message.success(response.message || '删除单词类型成功');
            getWordTypeListAll(formState)
            getWordTypeGroupAlls();
        } else {
            // 处理错误  
            message.error(response.message || '删除单词类型失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('删除单词类型数据时发生错误');
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
const formData: UnwrapRef<WordTypeUpdateRequest> = reactive({
    typeName: '',
    id: 0,
    typeGroupId: 0,
    typeGroupName: '',
    isGroupName: 0,
})

const IdRequest = {
    id: 0
}

//修改按钮
const onUpdate = async (wordTypeVO: WordTypeVO) => {
    IdRequest.id = wordTypeVO.id;
    const res = await getWordTypeByOne(IdRequest)
    if (res.code == 0) {
        visible.value = true;
        formData.typeName = res.data?.typeName as string;
        formData.isGroupName =  res.data?.isGroupName as number;
        formData.id =  res.data?.id as number;
        formData.typeGroupId =  res.data?.typeGroupId as number;
        formData.typeGroupName =  res.data?.typeGroupName as string;
    }


}

const formRef = ref<FormInstance>();

//弹框中：确认修改信息
const onOk = () => {
    formRef.value
        .validateFields()
        .then(async (values: any) => {
            const res = updateWordType(toRaw(formData));
            if ((await res).code == 0 && (await res).data) {
                message.success('修改成功');
                visible.value = false;
                getWordTypeListAll(wordTypeList);
                getWordTypeGroupAlls();
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
const formAdd = reactive<WordTypeAddRequest>({
    typeName: '',
    isGroupName: 0,
    id: undefined
});

//新增单词类型
const onAdd = () => {
    formRef2.value
        .validateFields()
        .then(async values => {
            formAdd.typeName = values.typeName;
            formAdd.isGroupName = values.isGroupName;
            formAdd.id = values.id;
            const res = await addWordType(formAdd);
            if (res.code == 0 && res.data) {
                message.success('新增成功');
                formAdd.typeName = '';
                formAdd.id = undefined;
                getWordTypeListAll(wordTypeList);
                if(formAdd.isGroupName == 1){
                    getWordTypeGroupAlls();
                }
                getWordTypeGroupAlls();
            } else {
                message.error(res.message);
            }
        })
        .catch(info => {
            message.error("新增失败");
        });
};

const wordTypeGroup = ref<WordTypeVO>()
//获取所有类型组
const getWordTypeGroupAlls = async () => {
    const res = await getWordTypeGroupAll();
    if (res.code == 0) {
        wordTypeGroup.value = res.data;
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
  