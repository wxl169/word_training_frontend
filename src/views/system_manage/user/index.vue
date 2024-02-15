<template>
    <a-table sticky :columns="columns" :data-source="data" :scroll="{ x: 1500 }">
        <template #title>
            <span style="font-size: 25px;">用户管理</span>
        </template>
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'avatar'">
                <img :src="record.avatar" alt="" style="width: 50px; height: 50px;" />
            </template>
            <template v-if="column.key === 'operation'">
                <a-space warp>
                    <a-tooltip title="修改按钮"  >
                        <a-button type="primary" size="small" @click="onUpdate(record.id)">
                            <template #icon>
                                <FormOutlined />
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-popconfirm title="确认删除?" @confirm="onDelete(record.id)">
                        <a-tooltip title="删除按钮">
                            <a-button type="primary" size="small" danger >
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
</template>



<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import {
    DeleteOutlined, FormOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';

const columns = ref<TableColumnsType>([
    {
        title: '序号',
        width: 100,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
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
        width: 60,
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
        width: 80,
        ellipsis: true,
    },
    {
        title: '积分数',
        dataIndex: 'pointNumber',
        key: 'pointNumber',
        width: 150,
        ellipsis: true,
    },
    {
        title: '连续在线天数',
        dataIndex: 'colineDay',
        key: 'colineDay',
        width: 150,
        ellipsis: true,
    },
    { title: '在线天数', dataIndex: 'onlineDay', key: 'onlineDay', width: 150, ellipsis: true, },
    { title: '最近在线时间', dataIndex: 'lastLoginTime', key: 'lastLoginTime', width: 150, ellipsis: true, },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150, ellipsis: true, },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
    },
]);

const data: any[] = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        id: 9999999,
        name: `Edrward ${i}`,
        userAccount: 209000243,
        address: `London Park no. ${i}`,
        username: '吴小龙',
        birthday: '2001-05-05',
        gender: '男',
        avatar: 'https://image.cqiewxl.cn/2023/09/26/97dbdd68b48e4027988d2ce90965cdd5.jpg',
        role: '管理员',
        pointNumber: 1,
        colineDay: 1,
        onlineDay: 1,
        lastLoginTime: '2024-2-12 08:12:46',
        createTime: '2024-2-12 08:12:46',
    });
}

//删除按钮
const onDelete = (key: string) => {
    console.log(key)
};

//修改按钮
const onUpdate = (key: string) =>{
    console.log(key)
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
  