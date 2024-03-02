<template>
    <div>
        <a-card>
            <template #title>
                <a-row>
                    <a-form layout="inline" style="margin-left: 30px;padding-top: 10px;" :model="formState">
                        <a-form-item name="tag" label="请选择标签:">
                            <a-select ref="select" v-model:value="formState.tagName" style="width: 250px" mode="multiple"
                                placeholder="请选择标签">
                                <a-select-option v-for="item in tagList" :value="item.tagName" :key="item.id">{{
                                    item.tagName }}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="内容">
                            <a-input placeholder="搜索当前分类下的内容" v-model:value="formState.content"></a-input>
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
            </template>
            <template #extra>
                <RouterLink to="/article/write">分享文章</RouterLink>
            </template>
        </a-card>
        <a-card style="margin-top: 20px;">
            <template #title>
                <div style="{padding: '20px';}">
                    <a-anchor direction="horizontal" :items="[
                        {
                            key: 'horizontally-part-1',
                            href: '',
                            title: '推荐',
                        },
                        {
                            key: 'horizontally-part-2',
                            href: '',
                            title: '最新',
                        },
                        {
                            key: 'horizontally-part-3',
                            href: '',
                            title: '最热',
                        },
                    ]" />
                </div>
            </template>
            Inner Card content
        </a-card>


    </div>
</template>

<script setup lang="ts">
import type { ArticleSelectRequest } from '@/api/article/type';
import { getTagVOListAll } from '@/api/tag';
import type { TagVO } from '@/api/tag/type';
import { onMounted, reactive, ref, type UnwrapRef } from 'vue';

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
        // getUserListAll(formState)
    },
    //页数改变是触发
    onChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.current = current;
        // getUserListAll(formState)
    }
});

//表单数据
const formState: UnwrapRef<ArticleSelectRequest> = reactive({
    content: '',
    tagName: [],
    current: rolePage.current,
    pageSize: rolePage.pageSize,
});

//搜索按钮
const onSubmit = () => {
    formState.current = 1;
    rolePage.current = 1;
    // getUserListAll(formState)
}

onMounted(() => {
    //获取所有文章数据

    //获取所有标签
    getTagListAll();
})

//重置按钮
const reset = () => {
    formState.content = '';
    formState.tagName = [];
    formState.current = 1;
    formState.pageSize = rolePage.pageSize;
    rolePage.current = 1;
    // getUserListAll(formState);
}


const tagList = ref<TagVO[]>([]);
//获取所有标签
const getTagListAll = async () => {
    const res = await getTagVOListAll();
    if (res.code == 0) {
        tagList.value = res.data
    }
}


</script>

<style scoped></style>