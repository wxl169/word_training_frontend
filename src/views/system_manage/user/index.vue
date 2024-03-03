<template>
    <div>
        <a-table sticky :columns="columns" :data-source="data" :pagination="rolePage" :scroll="{ x: 1500 }" row-key="id">
            <template #id="{ text, record, index }">
                {{ index + 1 }}
            </template>
            <template #title>
                <a-row>
                    <span style="font-size: 25px; font-weight: bold;" sans-serif>用户管理</span>
                    <!-- 搜索栏 -->
                    <a-form layout="inline" style="margin-left: 30px;padding-top: 10px;" :model="formState">
                        <a-form-item label="用户账号">
                            <a-input placeholder="请输入用户账号" v-model:value="formState.userAccount"></a-input>
                        </a-form-item>
                        <a-form-item label="用户名">
                            <a-input placeholder="请输入用户名" v-model:value="formState.username"></a-input>
                        </a-form-item>
                        <a-form-item name="gender" label="性别">
                            <a-select v-model:value="formState.gender" placeholder="请选择用户性别">
                                <a-select-option value="0">男</a-select-option>
                                <a-select-option value="1">女</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item name="role" label="角色">
                            <a-select v-model:value="formState.role" placeholder="请选择用户角色">
                                <a-select-option value="admin">系统管理员</a-select-option>
                                <a-select-option value="user">普通用户</a-select-option>
                                <a-select-option value="ban">封号</a-select-option>
                            </a-select>
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

                </a-row>
                <!-- 表格 -->
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'avatar'">
                    <img :src="record.avatar" alt="" style="width: 50px; height: 50px;" />
                </template>
                <template v-if="column.key === 'gender'">
                    <a-tag color="blue" v-if="record.gender === 0">男</a-tag>
                    <a-tag color="pink" v-if="record.gender === 1">女</a-tag>
                </template>
                <template v-if="column.key === 'role'">
                    <a-tag color="orange" v-if="record.role === 'admin'">系统管理员</a-tag>
                    <a-tag color="#2db7f5" v-if="record.role === 'user'">普通用户</a-tag>
                    <a-tag color="#f50" v-if="record.role === 'ban'"> 封号</a-tag>
                </template>
                <template v-if="column.key === 'birthday'">
                    {{ formatTime(record.birthday) }}
                </template>
                <template v-if="column.key === 'lastLoginTime'">
                    {{ formatTime(record.lastLoginTime) }}
                </template>
                <template v-if="column.key === 'createTime'">
                    {{ formatTime(record.createTime) }}
                </template>
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


    <!-- 修改用户信息 -->
    <div>
        <a-modal v-model:open="visible" title="修改用户信息" ok-text="确认" cancel-text="取消" @ok="onOk">
            <a-form ref="formRef" :model="formData" layout="vertical" name="form_in_modal">
                <a-form-item label="用户角色：" name="modifier" class="collection-create-form_last-form-item">
                    <a-radio-group v-model:value="formData.role">
                        <a-radio value="admin">系统管理员</a-radio>
                        <a-radio value="user">普通用户</a-radio>
                        <a-radio value="ban">账号封禁</a-radio>
                    </a-radio-group>
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
import { getUserList, deleteUser, updateUser } from '@/api/user/index';
import type { UserListRequest, UserListVO, DeleteRequest, UserUpdateRequest } from '@/api/user/type';

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
        title: '账号',
        width: 100,
        dataIndex: 'userAccount',
        key: 'userAccount',
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '昵称',
        dataIndex: 'username',
        key: 'username',
        width: 150,
        ellipsis: true,
    },
    {
        title: '生日',
        dataIndex: 'birthday',
        key: 'birthday',
        width: 150,
        ellipsis: true,
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 80,
        ellipsis: true,
    },
    {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 100,
        ellipsis: true,
    },
    {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        width: 100,
        ellipsis: true,
    },
    {
        title: '积分数',
        dataIndex: 'pointNumber',
        key: 'pointNumber',
        width: 100,
        ellipsis: true,
        sorter: (a, b) => a.pointNumber - b.pointNumber,
    },
    {
        title: '连续在线天数',
        dataIndex: 'coiledDay',
        key: 'coiledDay',
        width: 140,
        ellipsis: true,
        sorter: (a, b) => a.coiledDay - b.coiledDay,
    },
    {
        title: '在线天数',
        dataIndex: 'onlineDay',
        key: 'onlineDay',
        width: 130,
        ellipsis: true,
        sorter: (a, b) => a.onlineDay - b.onlineDay,
    },
    {
        title: '最近在线时间',
        dataIndex: 'lastLoginTime',
        key: 'lastLoginTime',
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
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
    },
];

//表格数据
let data = ref<UserListVO[]>([]);

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
        getUserListAll(formState)
    },
    //页数改变是触发
    onChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.current = current;
        getUserListAll(formState)
    }
});

//列表查询的参数
const userListRequest = reactive({
    userAccount: '',
    username: '',
    gender: undefined,
    role: undefined,
    current: rolePage.current,
    pageSize: rolePage.pageSize,
})

//向后台发送请求获取用户列表信息
const getUserListAll = async (userListRequest: UserListRequest) => {
    try {
        const response = await getUserList(userListRequest);
        if (response.code === 0) {
            // 接受数据成功  
            data.value = response.data?.rows as [];
            rolePage.total = response.data?.total as number
        } else {
            // 处理错误  
            message.error(response.message || '获取用户列表失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('请求用户列表时发生错误');
        console.error(error);
    }
};

//组件挂载完毕：发一次请求获取数据
onMounted(() => {
    getUserListAll(userListRequest);
})

//重置按钮
const reset = () => {
    formState.username = '';
    formState.gender = undefined;
    formState.role = undefined;
    formState.userAccount = '';
    formState.current = 1;
    formState.pageSize = rolePage.pageSize;
    rolePage.current = 1;
    getUserListAll(formState);
}

//表单数据
const formState: UnwrapRef<UserListRequest> = reactive({
    userAccount: '',
    username: '',
    gender: undefined,
    role: undefined,
    current: rolePage.current,
    pageSize: rolePage.pageSize,
});

//搜索按钮
const onSubmit = () => {
    formState.current = 1;
    rolePage.current = 1;
    getUserListAll(formState)
}

//删除用户id
const DeleteRequest = {
    id: 0
}

//删除按钮
const onDelete = async (key: number) => {
    DeleteRequest.id = key
    //管理员删除用户信息
    try {
        const response = await deleteUser(DeleteRequest);
        if (response.code === 0 && response.data) {
            // 接受数据成功  
            message.success( '删除用户成功');
            getUserListAll(formState)
        } else {
            // 处理错误  
            message.error(response.message || '删除用户失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('删除用户数据时发生错误');
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
const formData: UnwrapRef<UserUpdateRequest> = reactive({
    role: '',
    id: 0
})

//修改按钮
const onUpdate = (userListVO: UserListVO) => {
    visible.value = true;
    formData.role = userListVO.role
    formData.id = userListVO.id;
}

const formRef = ref<FormInstance>();

//弹框中：确认修改信息
const onOk = () => {
    formRef.value
        .validateFields()
        .then(async (values: any) => {
            const res = updateUser(toRaw(formData));
            if ((await res).code == 0) {
                message.success('修改成功');
                visible.value = false;
                getUserListAll(userListRequest);
            } else {
                message.error((await res).message);
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
  