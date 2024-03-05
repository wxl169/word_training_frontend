<template>
    <div>
        <!-- 条件搜索 -->
        <a-card>
            <template #title>
                <a-row>
                    <a-form layout="inline" style="margin-left: 30px;padding-top: 10px;" :model="formState">
                        <a-form-item name="tag" label="请选择标签:">
                            <a-select ref="select" v-model:value="formState.tagName" style="width: 250px"
                                mode="multiple" placeholder="请选择标签">
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
        <a-layout>
            <!-- 左侧样式 -->
            <a-layout-content class="contentStyle">
                <a-card style="margin-top: 20px;" class="article_all">
                    <!-- 数据展示排行 -->

                    <template #title>
                        <div style="padding: '20px';">
                            <a-anchor direction="horizontal" :items="[
                        {
                            key: 'horizontally-part-1',
                            href: '#horizontally-part-1',
                            title: '推荐',
                        },
                        {
                            key: 'horizontally-part-2',
                            href: '#horizontally-part-2',
                            title: '最新',
                        },
                        {
                            key: 'horizontally-part-3',
                            href: '#horizontally-part-3',
                            title: '最热',
                        },
                    ]" />
                        </div>
                    </template>
                    <div id="article" v-for="item in data" :key="item.id">
                        <a-card>
                            <div style="padding: 10px 10px 10px 20px;">
                                <!-- 头像 -->
                                <a-row>
                                    <a-col>
                                        <a-avatar :size="64" :src="item.avatar"></a-avatar>
                                    </a-col>
                                    <a-col style="margin-top: 20px;margin-left: 5px;">
                                        <span>{{ item.username }}</span>
                                    </a-col>
                                    <div v-if="item.achievementName != null">
                                        <div v-if="item.achievementLogo != null">
                                            <a-col style="margin-top: 14px;margin-left: 5px;">
                                                <a-tooltip :title="item.achievementName">
                                                    <a-avatar shape="square" style="width: 30px;height: 20px;"
                                                        :src="item.achievementLogo">
                                                    </a-avatar>
                                                </a-tooltip>
                                            </a-col>
                                        </div>
                                        <div v-else>
                                            <a-tag color="pink">{{ item.achievementName }}</a-tag>
                                        </div>
                                    </div>
                                </a-row>
                                <div class="left">
                                    <!-- 标题 -->
                                    <a :href="'/#/article/detail/' + item.id"  target="_blank">
                                        <h1>{{ item.title }}</h1>
                                    </a>
                                    <a :href="'/#/article/detail/' + item.id"  target="_blank">
                                        <!-- 描述 -->
                                        <p>{{ item.description }}</p>
                                    </a>
                                    <!-- 标签 -->
                                    <div class="tag-container">
                                        <div v-for="tag in item.tags" :key="tag">
                                            <a-tag color="blue">{{ tag }}</a-tag>
                                        </div>
                                    </div>
                                </div>
                                <div class="right" v-if="item.coverImage != null">
                                    <!-- 封面 -->
                                    <a-image :width="200" :src="item.coverImage" />
                                </div>
                                <!-- 修改时间、点赞、收藏、评论 -->
                                <a-row class="row">
                                    <a-col class="col time-col">
                                        <span>{{ formatTime(item.createTime) }}</span>
                                    </a-col>
                                    <a-col class="col action-col">
                                        <a-space :size="size">
                                            |
                                            <!-- 点赞 -->
                                            <div id="praise">
                                                <a-tooltip title="取消点赞" v-if="item.isPraise == 1">
                                                    <a-button type="text" :icon="h(LikeFilled)"
                                                        @click="unDoPraise(item.id)">
                                                        {{ item.praiseNumber }}
                                                    </a-button>
                                                </a-tooltip>
                                                <a-tooltip title="点赞" v-else>
                                                    <a-button type="text" :icon="h(LikeOutlined)"
                                                        @click="doPraise(item.id)">
                                                        {{ item.praiseNumber }}
                                                    </a-button>
                                                </a-tooltip>
                                            </div>
                                            |
                                            <!-- 收藏 -->
                                            <div id="collection">
                                                <a-tooltip title="取消收藏" v-if="item.isCollection == 1">
                                                    <a-button type="text" :icon="h(HeartFilled)"
                                                        @click="unDoCollection(item.id)">
                                                        {{ item.collectionNumber }}
                                                    </a-button>
                                                </a-tooltip>
                                                <a-tooltip title="收藏" v-else>
                                                    <a-button type="text" :icon="h(HeartOutlined)"
                                                        @click="doCollection(item.id)">
                                                        {{ item.collectionNumber }}
                                                    </a-button>
                                                </a-tooltip>
                                            </div>
                                            |
                                            <!-- 评论 -->
                                            <a-tooltip title="评论">
                                                <a-button type="text" :icon="h(MessageOutlined)">
                                                    {{ item.commentNumber }}
                                                </a-button>
                                            </a-tooltip>

                                        </a-space>
                                    </a-col>
                                </a-row>
                            </div>

                        </a-card>
                        <br>
                    </div>
                    <a-pagination v-model:current="rolePage.current" :total="rolePage.total" show-less-items
                        style="margin-top: 20px;margin-bottom: 20px;" />
                </a-card>
            </a-layout-content>

            <!-- 右侧样式 -->
            <a-layout-sider class="siderStyle" width="400px">ssss</a-layout-sider>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import { selectArticleListAll } from '@/api/article';
import { h } from 'vue';
import {
    SearchOutlined, CloseOutlined, HeartOutlined, LikeOutlined, MessageOutlined, EyeOutlined, LikeFilled, HeartFilled
} from '@ant-design/icons-vue';
import type { ArticleListAllVO, ArticleSelectRequest } from '@/api/article/type';
import { getTagVOListAll } from '@/api/tag';
import type { TagVO } from '@/api/tag/type';
import { message } from 'ant-design-vue';
import { onMounted, reactive, ref, type UnwrapRef } from 'vue';
import { addCollection, deleteCollection } from '@/api/collection';
import { addPraise, deletePraise } from '@/api/praise';
const size = ref('small' as const);

//分页
const rolePage = reactive({
    current: 1,
    total: 0,
    pageSize: 6,
    //页数改变是触发
    onChange: (current: number) => {
        formState.current = current;
        rolePage.current = current;
        getArticleAll(formState)
    }
});

//表单数据
const formState: UnwrapRef<ArticleSelectRequest> = reactive({
    content: '',
    tagName: [],
    current: rolePage.current,
});

//搜索按钮
const onSubmit = () => {
    formState.current = 1;
    rolePage.current = 1;
    getArticleAll(formState)
}

onMounted(() => {
    //获取所有文章数据
    getArticleAll(formState)
    //获取所有标签
    getTagListAll();
})

//重置按钮
const reset = () => {
    formState.content = '';
    formState.tagName = [];
    formState.current = 1;
    rolePage.current = 1;
    getArticleAll(formState);
}

//列表数据
const data = ref<ArticleListAllVO[]>([]);
//根据条件获取文章信息
const getArticleAll = async (articleSelectRequest: ArticleSelectRequest) => {
    const res = await selectArticleListAll(articleSelectRequest)
    if (res.code == 0) {
        rolePage.total = res.data?.total as number
        data.value = res.data?.rows as [];
    } else {
        message.error(res.message);
    }
}

const tagList = ref<TagVO[]>([]);
//获取所有标签
const getTagListAll = async () => {
    const res = await getTagVOListAll();
    if (res.code == 0) {
        tagList.value = res.data
    }
}

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


//点赞
const PraiseRequest = {
    id: 0,
    type: 0
}
//点赞文章
const doPraise = async (id: number) => {
    PraiseRequest.id = id
    const res = await addPraise(PraiseRequest);
    if (res.code == 0 && res.data) {
        getArticleAll(formState);
    } else {
        message.error(res.message)
    }
}
//取消点赞
const unDoPraise = async (id: number) => {
    PraiseRequest.id = id
    const res = await deletePraise(PraiseRequest);
    if (res.code == 0 && res.data) {
        getArticleAll(formState);
    } else {
        message.error(res.message)
    }
}
//收藏文章
const CollectionRequest = {
    id: 0,
    type: 0
}
//收藏文章
const doCollection = async (id: number) => {
    CollectionRequest.id = id
    const res = await addCollection(CollectionRequest);
    if (res.code == 0 && res.data) {
        getArticleAll(formState);
    } else {
        message.error(res.message)
    }
}
//取消收藏
const unDoCollection = async (id: number) => {
    CollectionRequest.id = id
    const res = await deleteCollection(CollectionRequest);
    if (res.code == 0 && res.data) {
        getArticleAll(formState);
    } else {
        message.error(res.message)
    }
}

</script>





<style scoped>
* {
    /deep/.ant-card-body {
        padding: 0 !important
    }
}

.siderStyle {
    text-align: center;
    line-height: 120px;
    background-color: white;
}

.contentStyle {
    min-height: 120;
    line-height: 120px;
}

.tag-container {
    display: flex;
    flex-wrap: nowrap;
    /* 防止标签换行 */
    justify-content: flex-start;
    /* 控制标签的对齐方式，如左对齐、右对齐等 */
    align-items: center;
    /* 控制标签的垂直对齐方式 */
    gap: 1px;
    /* 控制标签之间的间距 */
    margin-top: 10px;
}

.left {
    float: left;
    width: 80%;
    /* 调整宽度可以根据需要进行修改 */
}

.right {
    float: right;
    width: 20%;
    /* 调整宽度可以根据需要进行修改 */
}

.row {
    clear: both;
}

.row .col {
    float: left;
}

.time-col {
    margin-top: 6px;
}

.action-col {
    margin-left: 10px;
}

a {  
  color: inherit; /* 继承父元素的颜色 */  
  text-decoration: none; /* 去除下划线 */  
}  
  
a:hover {  
  color: inherit; /* 鼠标悬停时保持颜色不变 */  
  text-decoration: underline; /* 鼠标悬停时显示下划线 */  
}  
  
a:active, a:focus {  
  outline: 0; /* 去除点击或聚焦时的轮廓 */  
}
</style>