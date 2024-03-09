<template>
  <div style="margin-bottom: 30px;">
    <a-layout>
      <!-- 左侧样式 -->
      <a-layout-content class="contentStyle">
        <!-- 内容 -->
        <a-card style="margin-top: 50px;" class="article_all">
          <template #title>
            <div style="padding: 10px 10px 10px 10px;">
              <!-- 头像 -->
              <a-row>
                <a-col>
                  <a-avatar :size="64" :src="articleData.avatar"></a-avatar>
                </a-col>
                <a-col style="margin-left: 10px;">
                  <div class="left">
                    <span>{{ articleData.username }}</span>
                    <!-- 勋章 -->
                    <div v-if="articleData.achievementName != null" style="display: inline-block;margin-left: 30px;">
                      <div v-if="articleData.achievementLogo != null" style="display: inline-block;">
                        <a-tooltip :title="articleData.achievementName">
                          <a-avatar shape="square" style="width: 30px;height: 20px;" :src="articleData.achievementLogo">
                          </a-avatar>
                        </a-tooltip>
                      </div>
                      <div v-else style="display: inline-block;">
                        <a-tag color="pink">{{ articleData.achievementName }}</a-tag>
                      </div>
                    </div>
                    <br>
                    <!-- 发布时间/浏览量 -->
                    <div style="margin-top: 20px;" class="ant-space-item">
                      <span>
                        发布时间:&nbsp;{{ formatTime(articleData.createTime) }} &nbsp;&nbsp; | &nbsp;&nbsp; 浏览量:&nbsp;{{
                    articleData.visitNumber }} &nbsp;&nbsp;&nbsp;|
                      </span>
                      <!-- 标签 -->
                      <div class="tag-container">
                        文章标签：
                        <div v-for="tag in articleData.tags" :key="tag">
                          <a-tag color="blue">{{ tag }}</a-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="right" v-if="loginUserId != articleData.userId">
                    <div v-if="articleData.isAddUser == 1">
                      <a-button type="primary" danger :icon="h(PlusOutlined)"
                        @click="unDoCare(articleData.userId)">取消关注</a-button>
                    </div>
                    <div v-else>
                      <a-button type="primary" :icon="h(PlusOutlined)" @click="doCare(articleData.userId)">关注</a-button>
                    </div>
                  </div>
                </a-col>
                <div v-if="articleData.achievementName != null">
                  <div v-if="articleData.achievementLogo != null">
                    <a-col style="margin-top: 14px;margin-left: 5px;">
                      <a-tooltip :title="articleData.achievementName">
                        <a-avatar shape="square" style="width: 30px;height: 20px;" :src="articleData.achievementLogo">
                        </a-avatar>
                      </a-tooltip>
                    </a-col>
                  </div>
                  <div v-else>
                    <a-tag color="pink">{{ articleData.achievementName }}</a-tag>
                  </div>
                </div>
              </a-row>
            </div>
          </template>
          <!-- 文章数据展示 -->
          <div>
            <div id="title">
              <div class="left">
                <!-- 标题 -->
                <strong style="font-size: 32px;">{{ articleData.title }}</strong>
                <!-- 描述 -->
                <br>
                <div style="margin-top: 10px;">
                  <b>描述：</b><span style="color: #333;">{{ articleData.description }}</span>
                </div>
              </div>
              <div class="right" v-if="articleData.coverImage != null">
                <!-- 封面 -->
                <a-image :width="100" :src="articleData.coverImage" />
              </div>
            </div>
            <a-divider />
            <div id="content">
              <div v-html="articleData.content">

              </div>
            </div>
          </div>
        </a-card>
        <!-- 点赞/收藏/评论/操作 -->
        <a-card>
          <a-card-grid style="width: 25%; text-align: center">
            <!-- 点赞 -->
            <div id="praise">
              <a-tooltip title="取消点赞" v-if="articleData.isPraise == 1">
                <a-button type="text" @click="unDoPraise(articleData.id)" style="width: 100%;height: 100%;">

                  <template #icon>
                    <LikeFilled style="font-size:20px" />
                  </template>
                  <span style="font-size: 20px;">{{ articleData.praiseNumber }}</span>
                </a-button>
              </a-tooltip>
              <a-tooltip title="点赞" v-else>
                <a-button type="text" @click="doPraise(articleData.id)" style="width: 100%;height: 100%;">

                  <template #icon>
                    <LikeOutlined style="font-size:20px" />
                  </template>
                  <span style="font-size: 20px;">{{ articleData.praiseNumber }}</span>
                </a-button>
              </a-tooltip>

            </div>
          </a-card-grid>
          <a-card-grid style="width: 25%; text-align: center">
            <!-- 收藏 -->
            <div id="collection">
              <a-tooltip title="取消收藏" v-if="articleData.isCollection == 1">
                <a-button type="text" @click="unDoCollection(articleData.id)" style="width: 100%;height: 100%;">

                  <template #icon>
                    <HeartFilled style="font-size:20px" />
                  </template>
                  <span style="font-size: 20px;">{{ articleData.collectionNumber }}</span>
                </a-button>
              </a-tooltip>
              <a-tooltip title="收藏" v-else>
                <a-button type="text" @click="doCollection(articleData.id)" style="width: 100%;height: 100%;">

                  <template #icon>
                    <HeartOutlined style="font-size:20px" />
                  </template>
                  <span style="font-size: 20px;">{{ articleData.collectionNumber }}</span>
                </a-button>
              </a-tooltip>
            </div>
          </a-card-grid>
          <a-card-grid style="width: 25%; text-align: center">
            <!-- 评论 -->
            <a-tooltip title="评论">
              <a-button type="text" style="width: 100%;height: 100%;" @click="toMessage()">

                <template #icon>
                  <MessageOutlined style="font-size:20px" />
                </template>
                <span style="font-size: 20px;">{{ articleData.commentNumber }}</span>
              </a-button>
            </a-tooltip>
          </a-card-grid>
          <a-card-grid style="width: 25%; text-align: center">
            <!-- 操作 -->
            <a-tooltip title="操作">
              <a-dropdown>

                <template #overlay>
                  <a-menu style="text-align: center;">
                    <a-menu-item key="1" @click="visible = true">
                      <ExclamationCircleFilled />
                      投诉
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="text" style="width: 100%;height: 100%;">

                  <template #icon>
                    <MenuOutlined style="font-size:20px" />
                  </template>
                  <span style="font-size: 20px;">操作</span>
                </a-button>
              </a-dropdown>
            </a-tooltip>
          </a-card-grid>
        </a-card>
        <!-- 评论区 -->
        <div id="message">
          <Comment :articleId="articleData.id"></Comment>
        </div>
      </a-layout-content>

      <!-- 右侧样式 -->
      <a-layout-sider class="siderStyle" width="400px">
        ssss
      </a-layout-sider>
    </a-layout>
  </div>
  <!-- 投诉框 -->
  <a-modal v-model:open="visible" title="我要举报" ok-text="举报" cancel-text="取消" @ok="onOk">
    <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal" :rules="rules">
      <a-form-item name="complainContent" label="举报原因">
        <a-textarea v-model:value="formState.complainContent" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  HeartOutlined, LikeOutlined, MessageOutlined, MenuOutlined, LikeFilled, HeartFilled, PlusOutlined, ExclamationCircleFilled
} from '@ant-design/icons-vue';
import { h, reactive, toRaw, type UnwrapRef } from 'vue';
import { selectArticleOneById } from '@/api/article';
import { message, type FormInstance } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { addPraise, deletePraise } from '@/api/praise';
import { addCollection, deleteCollection } from '@/api/collection';
import type { ArticleOneVO } from '@/api/article/type';
import { addFriend, deleteFriend } from '@/api/user';
import Comment from '@/components/comment/index.vue';
import type { ComplainAddRequest } from '@/api/complain/type';
import type { Rule } from 'ant-design-vue/es/form';
import { addComplain } from '@/api/complain';
import pinia from '@/store';
import useUserStore from '@/store/modules/user'

const route = useRoute();
const articleId = route.params.id;
const loginUserId = ref(0)

// 你可以使用 onMounted 钩子来在组件挂载后获取数据  
onMounted(() => {
  try {
    getArticleOne(articleId)
  } catch (error) {
    console.error('Error fetching article data:', error);
  }
  const userStore = useUserStore(pinia)
  if (userStore.userId != null && userStore.userId > 0) {
    loginUserId.value = userStore.userId;
  }
});

const IdRequest = {
  id: 0
}

//文章数据
const articleData = ref<ArticleOneVO>({} as ArticleOneVO);

//根据id获取文章详情信息
const getArticleOne = async (id: number) => {
  IdRequest.id = id;
  const res = await selectArticleOneById(IdRequest);
  if (res.code == 0) {
    articleData.value = res.data
  } else {
    message.error(res.message)
  }
}
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
    getArticleOne(id);
  } else {
    message.error(res.message)
  }
}
//取消点赞
const unDoPraise = async (id: number) => {
  PraiseRequest.id = id
  const res = await deletePraise(PraiseRequest);
  if (res.code == 0 && res.data) {
    getArticleOne(id);
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
    getArticleOne(id);
  } else {
    message.error(res.message)
  }
}
//取消收藏
const unDoCollection = async (id: number) => {
  CollectionRequest.id = id
  const res = await deleteCollection(CollectionRequest);
  if (res.code == 0 && res.data) {
    getArticleOne(id);
  } else {
    message.error(res.message)
  }
}

//关注发布者
const doCare = async (id: number) => {
  IdRequest.id = id;
  const res = await addFriend(IdRequest);
  if (res.code == 0 && res.data) {
    message.success("关注成功")
    getArticleOne(articleId);
  } else {
    message.error(res.message);
  }
}
//取关发布者
const unDoCare = async (id: number) => {
  IdRequest.id = id;
  const res = await deleteFriend(IdRequest);
  if (res.code == 0 && res.data) {
    message.success("取关成功")
    getArticleOne(articleId);
  } else {
    message.error(res.message);
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

//打开评论区
const openMessage = ref(false);
const toMessage = () => {
  if (openMessage.value) {
    openMessage.value = false;
  } else {
    openMessage.value = true;
  }

}


const formRef = ref<FormInstance>();
const visible = ref(false);

//表单数据
const formState: UnwrapRef<ComplainAddRequest> = reactive({
  complainId: 0,
  type: 0,
  complainContent: '',//投诉内容
  isComplainUserId: 0 //被投诉用户的id
});
const rules: Record<string, Rule[]> = {
  complainContent: [
    { required: true, message: '请输入投诉原因', trigger: 'change' }
  ],
};
//投诉
const onOk = () => {
  formRef.value
    .validateFields()
    .then(async values => {
      formState.complainId = articleId;
      formState.isComplainUserId = articleData.value.userId;
      console.log(formState)
      const res = await addComplain(formState);
      if (res.code == 0) {
        message.success("投诉成功");
        formState.complainContent = '';
        visible.value = false;
      } else {
        message.error(res.message);
      }
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
};

</script>



<style scoped>
.siderStyle {
  text-align: center;
  line-height: 120px;
  background-color: white;
}

.contentStyle {
  min-height: 120;
  line-height: 120px;
  background-color: white;
}

#title {
  /* 如果需要，可以添加一些样式来包含浮动元素 */
  overflow: auto;
  /* 或者使用其他包含浮动元素的方法 */
}

.left {
  float: left;
  width: 800px;
  /* 调整宽度可以根据需要进行修改 */
}

.right {
  float: right;
  width: 100px;
  /* 调整宽度可以根据需要进行修改 */
}

#content {
  clear: both;
  /* 清除之前的所有浮动 */
  margin-top: 20px;
  /* 如果需要，可以添加上边距来分隔内容 */
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
}

.ant-space-item {
  display: flex;
  align-items: center;
  /* 垂直居中 */
}

.ant-space-item>span {
  margin-right: 20px;
  /* 根据需要调整右边距 */
}


.tag-container>div {
  margin-right: 10px;
  /* 标签之间的间距 */
}

.function {
  text-align: center;
}

* {
  /deep/:where(.css-dev-only-do-not-override-1hsjdkk).ant-card .ant-card-grid {
    padding: 0 !important
  }
}
</style>