<template>
  <div style="margin-top: 10px;">
    <a-anchor direction="horizontal" :items="[
      {
        key: 'user-info',
        href: '#user-info',
        title: '个人信息',
      },
      {
        key: 'login-time',
        href: '#login-time',
        title: '在线天数',
      },
      {
        key: 'collection',
        href: '#collection',
        title: '收藏夹',
      },
    ]" @click="handleClick2" />
  </div>

  <!-- 个人信息 -->
  <a-card hoverable style="width: 100%; margin-top: 10px" title="个人信息" id="user-info">
    <template #extra>
      <!-- 修改操作 -->
      <div>
        <a-button type="primary" @click="onUpdate()">修改信息</a-button>
        <a-button danger @click="onUpdatePassword()" style="margin-left: 10px">修改密码</a-button>
              <!-- 用户信息修改 -->
        <a-modal v-model:open="visible" title="个人信息修改" ok-text="确认" cancel-text="取消" @ok="onOk">
          <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
            <a-form-item name="username" label="姓名" :rules="[{ required: true, message: '请输入您的用户名!' }]">
              <a-input v-model:value="formState.username" />
            </a-form-item>
            <a-form-item name="birthday" label="出生日期">
              <a-date-picker v-model:value="formState.birthday" value-format="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item label="手机号" name="phone"
              :rules="[{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号格式不正确' }]">
              <a-input v-model:value="formState.phone" placeholder="请输入手机号"></a-input>
            </a-form-item>

            <a-form-item label="邮箱" name="email" :rules="[{ type: 'email', message: '邮箱格式不正确' }]">
              <a-input v-model:value="formState.email" placeholder="请输入邮箱"></a-input>
            </a-form-item>
            <a-form-item name="gender" label="性别" class="collection-create-form_last-form-item"
              :rules="[{ required: true, message: '请输入您的性别!' }]">
              <a-radio-group v-model:value="formState.gender">
                <a-radio :value="0">男</a-radio>
                <a-radio :value="1">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-modal>
        <!-- 修改密码 -->
        <a-modal v-model:open="visible_password" title="修改密码" ok-text="确认" cancel-text="取消" @ok="onOk">
          <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
            <a-form-item label="原密码" name="oldPassword" :rules="[{ required: true, message: '请输入您的原密码' }]">
              <a-input-password v-model:value="formState.oldPassword">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item label="新密码" name="newPassword"
              :rules="[{ required: true, message: '请输入您的新密码' }, { min: 8, max: 16, message: '密码长度为8-16位', trigger: 'blur' }]">
              <a-input-password v-model:value="formState.newPassword">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item label="确认新密码" name="sureNewPassword"
              :rules="[{ required: true, message: '请再次输入您的新密码' }, { min: 8, max: 16, message: '密码长度为8-16位', trigger: 'blur' }]">
              <a-input-password v-model:value="formState.sureNewPassword">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </template>
    <div class="space-align-block">
      <a-space align="center">
        <!-- 头像 -->
        <div class="avatar" style="margin-left: 66px;">
          <a-image :width="128" :src="loginUserInfo?.avatar" />
          <a-card-meta>
            <template #description>
              <div>
                <input type="file" ref="fileInput" style="display: none;" :change="handleFileChange">
                <a-button ghost style="color: black; margin-top: 10px; margin-left: 18px;"
                  @click="openFileInput">修改头像</a-button>
              </div>
            </template>
          </a-card-meta>
        </div>
        <!-- 个人详情 -->
        <a-descriptions style="margin-left: 50px">
          <a-descriptions-item label="账号">{{ loginUserInfo?.userAccount }}</a-descriptions-item>
          <a-descriptions-item label="用户名">{{ loginUserInfo?.username }}</a-descriptions-item>
          <a-descriptions-item label="出生日期">
            <span v-if="loginUserInfo?.birthday == null">暂未提供出生日期</span>
            <span v-else>{{ formatTime(loginUserInfo?.birthday) }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="性别">
            <span v-if="loginUserInfo?.gender == 0">男</span>
            <span v-else>女</span>
          </a-descriptions-item>
          <a-descriptions-item label="身份">
            <span v-if="loginUserInfo?.role == 'admin'">系统管理员</span>
            <span v-else-if="loginUserInfo?.role == 'user'">普通用户</span>
            <span v-else>封禁</span>
          </a-descriptions-item>
          <a-descriptions-item label="手机号">{{ loginUserInfo?.phone }}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{ loginUserInfo?.email }}</a-descriptions-item>
          <a-descriptions-item label="积分数">
            {{ loginUserInfo?.pointNumber }}
          </a-descriptions-item>
          <a-descriptions-item label="每日挑战次数">{{ loginUserInfo?.challengeNum }}次</a-descriptions-item>
        </a-descriptions>
      </a-space>
    </div>
  </a-card>

  <!-- 在线天数 -->
  <a-card hoverable style="width: 100%; margin-top: 10px; display: flex; justify-content: center; align-items: center;"
    :bodyStyle="{ padding: 0 }" id="login-time">
    <h3 style="font-weight: bold; font-size: 24px; color: #78c2cf; text-shadow: 2px 2px 4px #c4c4e6;"> 🎉累计在线:{{
      loginUserInfo?.onlineDay }}天，当前已连续在线:{{ loginUserInfo?.coiledDay }}天，最近在线时间:{{
      formatTime2(loginUserInfo?.lastLoginTime) }} 🎉</h3>
  </a-card>

  <!-- 收藏夹 -->
  <a-card hoverable style="width: 100%; margin-top: 10px;margin-bottom: 20px" id="collection">
    <!-- 收藏夹头部样式 -->
    <template #title>
      <div class="container">
        <span style="margin-right: 50px; font-size: 16px;">收藏夹</span>
        <a-anchor direction="horizontal" :items="[
      {
        key: 'collection_article',
        href: '#collection_article',
        title: '文章',
      },
      {
        key: 'collection_word',
        href: '#collection_word',
        title: '单词',
      },
    ]" @click="handleClick" style="flex-grow: 1; text-align: center;">
        </a-anchor>
        <div style="margin-left: 50px;">
          <a-button type="primary" @click="onShow" v-if="show == false">展示</a-button>
          <a-button danger @click="onShow" v-if="show == true">关闭</a-button>
        </div>
      </div>
    </template>
    <!-- 文章/单词展示 -->
    <div v-if="show == true">
      <!-- 文章列表 -->
      <div v-if="activeTab === '文章'" id="collection_article">
        <!-- 没有收藏文章数据时显示 -->
        <div v-if="data.length == 0">
          <a-empty
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
            :image-style="{
      height: '60px'
    }">
            <template #description>
              <span>
                暂未收藏文章，请前往
                <router-link :to="{ path: '/article/home' }">
                  社区
                </router-link>
                寻找
              </span>
            </template>
          </a-empty>
        </div>
        <!-- 收藏文章数据时显示 -->
        <div v-else>
          <div id="article" v-for="item in data" :key="item.collectionId">
            <a-card :bodyStyle="{ padding: 0 }">
              <div
                style="padding: 0px 10px 0px 20px; display: flex; justify-content: space-between; align-items: center;">
                <div class="left">
                  <!-- 标题 -->
                  <a :href="'/#/article/detail/' + item.collectionId" target="_blank" style="color: black;">
                    <h1>{{ item.title }}</h1>
                  </a>
                </div>
                <div class="right">
                  <a-tooltip title="取消收藏" v-if="item.isCollection == 1">
                    <a-button type="text" @click="unDoCollection(item.collectionId, 0)">
                      <template #icon>
                        <HeartFilled style="font-size: 25px;" />
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip title="收藏" v-else>
                    <a-button type="text" @click="doCollection(item.collectionId, 0)">
                      <template #icon>
                        <HeartOutlined style="font-size: 25px;" />
                      </template>
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </a-card>
            <br>
          </div>
          <a-pagination v-model:current="rolePage.current" :defaultPageSize="rolePage.pageSize" :total="rolePage.total"
            :show-less-items="true" style="margin-top: 20px;margin-bottom: 20px;" @change="rolePage.onChange"
            :show-total="total => `共 ${rolePage.total} 条数据`" />
        </div>
      </div>

      <!-- 单词列表 -->
      <div v-if="activeTab === '单词'" id="collection_word">
        <!-- 没有收藏单词数据时显示 -->
        <div v-if="data.length == 0">
          <a-empty
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
            :image-style="{
      height: '60px'
    }">
            <template #description>
              <span>
                暂未收藏单词，请前往
                <router-link :to="{ path: '/word/bank' }">
                  单词百科
                </router-link>
                寻找
              </span>
            </template>
          </a-empty>
        </div>
        <!-- 收藏单词数据时显示 -->
        <div v-else>
          <div id="word" v-for="item in data" :key="item.collectionId">
            <a-card :bodyStyle="{ padding: 0 }">
              <div
                style="padding: 0px 10px 0px 20px; display: flex; justify-content: space-between; align-items: center;">
                <div class="left">
                  <a-space align="center">
                    <!-- 单词 -->
                    <div style="width: 250px;">
                      <strong style="font-size: 20px;">{{ item.word }}</strong>
                    </div>
                    <!-- 发音 -->
                    <div style="width: 300px;">
                      <div> 英：{{ item.pronounceEnglish }}
                        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
                          @click="playAudio(`http://dict.youdao.com/dictvoice?type=1&audio=${item.word}`)" />
                      </div>
                      <div> 美：{{ item.pronounceAmerica }}
                        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
                          @click="playAudio(`http://dict.youdao.com/dictvoice?type=0&audio=${item.word}`)" />
                      </div>
                    </div>
                    <!-- 翻译 -->
                    <div>
                      <div v-for="i in item.translation" :key="i">
                        <span>{{ i }}</span>
                      </div>
                    </div>
                  </a-space>
                </div>
                <!--查看详情/收藏按钮 -->
                <div class="right">
                  <a-space align="center">
                    <!-- 查看详情按钮 -->
                    <div>
                      <a-button type="dashed" ghost size="small" @click="onSelect(item.collectionId)"
                        style="color: black;">
                        <template #icon>
                          <ZoomInOutlined style="font-size: 25px;" />
                        </template>
                      </a-button>
                    </div>
                    <!-- 取消收藏按钮 -->
                    <div id="collection_word_right" style="margin-left: 10px;">
                      <a-tooltip title="取消收藏" v-if="item.isCollection == 1">
                        <a-button type="text" @click="unDoCollection(item.collectionId, 1)">
                          <template #icon>
                            <HeartFilled style="font-size: 25px;" />
                          </template>
                        </a-button>
                      </a-tooltip>
                      <a-tooltip title="收藏" v-else>
                        <a-button type="text" @click="doCollection(item.collectionId, 1)">
                          <template #icon>
                            <HeartOutlined style="font-size: 25px;" />
                          </template>
                        </a-button>
                      </a-tooltip>
                    </div>
                  </a-space>


                </div>
              </div>
            </a-card>
            <br>
          </div>
          <a-pagination v-model:current="rolePage.current" :defaultPageSize="rolePage.pageSize" :total="rolePage.total"
            :show-less-items="true" style="margin-top: 20px;margin-bottom: 20px;" @change="rolePage.onChange"
            :show-total="total => `共 ${rolePage.total} 条数据`" />
        </div>
      </div>
    </div>
  </a-card>

  <!-- 单词详情 -->
  <a-modal v-model:open="choose" cancelText="关闭" :ok-button-props="{ disabled: true }"
    style="width: 666px; height: 100%;">
    <a-card style="width: 600px;">
      <!-- 单词 -->
      <h1>{{ wordBankVO?.word }}</h1>
      <!-- 发音 -->
      <div class="pronounce">
        英：{{ wordBankVO?.pronounceEnglish }}
        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
          @click="playAudio(`http://dict.youdao.com/dictvoice?type=1&audio=${wordBankVO?.word}`)" />
        &nbsp;&nbsp;
        美：{{ wordBankVO?.pronounceAmerica }}
        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
          @click="playAudio(`http://dict.youdao.com/dictvoice?type=0&audio=${wordBankVO?.word}`)" />
      </div>
      <!-- 释义 -->
      <h6 style="font-size: 13px;margin-top: 5px;">【释义】</h6>
      <a-space-compact direction="vertical">
        <div v-for="item in wordBankVO?.translation" :key="item">
          <span>{{ item }}</span>
        </div>
      </a-space-compact>
    </a-card>
    <a-card style="width: 600px;padding: 0;" id="word">
      <!-- 例句 -->
      <h6 style="font-size: 13px;margin-top: 5px;">【例句】</h6>
      <a-space-compact direction="vertical" v-if="wordBankVO?.example != null">
        <div v-for="(value, key) in wordBankVO?.example" :key="key">
          <span>{{ key }}</span><br>
          <span>{{ value }}</span>
        </div>
      </a-space-compact>
      <a-space v-else>
        无
      </a-space>
      <!-- 同义词 -->
      <h6 style="font-size: 13px;margin-top: 10px;">【同义词】</h6>
      <a-space :size="[1, 1]" wrap v-if="wordBankVO?.synonym != null">
        <template v-for="item in wordBankVO?.synonym" :key="item">
          {{ item }};&nbsp;
        </template>
      </a-space>
      <a-space v-else>
        无
      </a-space>
      <!-- 反义词 -->
      <h6 style="font-size: 13px;margin-top: 5px;">【反义词】</h6>
      <a-space :size="[1, 1]" wrap v-if="wordBankVO?.antonym != null">
        <template v-for="item in wordBankVO?.antonym" :key="item">
          <a href="#">{{ item }}</a>,
        </template>
      </a-space>
      <a-space v-else>
        无
      </a-space>
      <!-- 时态复数 -->
      <h6 style="font-size: 13px;margin-top: 5px;">【时态复数】</h6>
      <a-space-compact direction="vertical" v-if="wordBankVO?.exchange != null">
        <div v-for="(value, key) in wordBankVO?.exchange" :key="key">
          <span>{{ key }}：&nbsp;</span>
          <span>{{ value }}</span>
        </div>
      </a-space-compact>
      <a-space v-else>
        无
      </a-space>
    </a-card>

  </a-modal>

</template>





<script setup lang="ts">
import { getUserInfo, updateUserInfo, uploadImage } from '@/api/user';
import type { LoginUserVO } from '@/api/user/type';
import { onMounted, ref, type UnwrapRef } from 'vue'
import { reactive, toRaw, h } from 'vue';
import { message, type FormInstance, type AnchorProps } from 'ant-design-vue';
const loginUserInfo = ref<LoginUserVO>();
import {
  HeartOutlined, HeartFilled, SoundOutlined, ZoomInOutlined
} from '@ant-design/icons-vue';
import { addCollection, deleteCollection, getCollectionByUserId } from '@/api/collection';
import type { CollectionGetRequest, CollectionGetVO } from '@/api/collection/type';
import type { SizeType } from 'ant-design-vue/es/config-provider';
import { getWordDetails } from '@/api/word/word';
import type { WordListVO } from '@/api/word/word/type';
const size = ref<SizeType>('small');


//组件挂载完毕：发一次请求获取数据
onMounted(async () => {
  const res = await getUserInfo();
  if (res.code == 0) {
    loginUserInfo.value = res.data;
  }
})

//修改按钮
const onUpdate = () => {
  visible.value = true;
  formState.username = loginUserInfo.value?.username as string
  formState.id = loginUserInfo.value?.id as number;
  formState.birthday = formatTime(loginUserInfo.value?.birthday) as string;
  formState.gender = loginUserInfo.value?.gender as number;
  formState.phone = loginUserInfo.value?.phone as string;
  formState.email = loginUserInfo.value?.email as string;
}

const formRef = ref<FormInstance>();
const visible = ref(false);
//修改模块数据
const formState = reactive({
  id: 0,
  birthday: '',
  username: '',
  gender: 0,
  phone: '',
  email: '',
  oldPassword:'',
  newPassword:'',
  sureNewPassword:''
});

//确认修改
const onOk = () => {
  formRef.value
    .validateFields()
    .then(async values => {
      const res = await updateUserInfo(toRaw(formState));
      if (res.code == 0 && res.data) {
        message.success('修改成功');
        visible.value = false;
        // 刷新当前页面
        location.reload();
      } else {
        message.error(res.message);
      }
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
};


//时间格式化
const formatTime = (timeArray: number[]) => {
  if (timeArray !== null && timeArray !== undefined) {
    const date = new Date(...timeArray);
    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth())).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    // 拼接成格式化后的时间字符串，例如：2024-02-16
    return `${year}-${month}-${day}`;
  }
};

//时间格式化
const formatTime2 = (timeArray: number[]) => {
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

//修改头像
const fileInput = ref(null);

const openFileInput = () => {
  fileInput.value?.click();
};

//验证图片是否符合格式要求
const handleFileChange = (event: { target: { files: any[]; }; }) => {
  const file = event.target.files[0];
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
  if (file) {
    uploadAvatar(file);
  }
};

//修改图片
const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file); // 注意这里的 'avatar' 与后端接口的参数名对应
    const response = await uploadImage(formData);
    if (response.code == 0) {
      message.success('修改头像成功')
      // 刷新当前页面
      location.reload();
    } else {
      message.error(response.message)
    }
  } catch (error) {
    message.error('修改头像失败:' + error)
  }
};

//收藏夹展示隐藏
const show = ref(false);
const onShow = () => {
  show.value = !show.value;
  getCollection(formData)
}

const activeTab = ref('文章');
//点击锚点，切换数据
const handleClick: AnchorProps['onClick'] = (e, link) => {
  show.value = true;
  e.preventDefault();
  activeTab.value = link.title;
  formData.current = 1;
  rolePage.current = 1;
  if (link.title == '文章') {
    formData.type = 0;
    getCollection(formData);
  } else if (link.title = "单词") {
    formData.type = 1;
    getCollection(formData);
  }
};


//分页
const rolePage = reactive({
  current: 1,
  total: 0,
  pageSize: 5,
  //页数改变是触发
  onChange: (current: number) => {
    formData.current = current;
    rolePage.current = current;
    getCollection(formData)
  }
});

//表单数据
const formData: UnwrapRef<CollectionGetRequest> = reactive({
  type: 0,
  pageSize: rolePage.pageSize,
  current: rolePage.current,
});

//列表数据
const data = ref<CollectionGetVO[]>([]);
//根据条件获取收藏文章信息
const getCollection = async (collectionGetRequest: CollectionGetRequest) => {
  const res = await getCollectionByUserId(collectionGetRequest)
  if (res.code == 0) {
    rolePage.total = res.data?.total as number
    console.log(rolePage.total)
    data.value = res.data?.rows as [];
  } else {
    message.error(res.message);
  }
}

//收藏文章
const CollectionRequest = {
  id: 0,
  type: 0
}

//收藏文章
const doCollection = async (id: number, type: number) => {
  CollectionRequest.id = id
  CollectionRequest.type = type
  const res = await addCollection(CollectionRequest);
  if (res.code == 0 && res.data) {
    getCollection(formData);
  } else {
    message.error(res.message)
  }
}

//取消收藏
const unDoCollection = async (id: number, type: number) => {
  CollectionRequest.id = id
  CollectionRequest.type = type
  const res = await deleteCollection(CollectionRequest);
  if (res.code == 0 && res.data) {
    getCollection(formData);
  } else {
    message.error(res.message)
  }
}

//播放单词音频
const playAudio = (url: string) => {
  console.log(url)
  // 创建新的音频元素
  const audio = new Audio(url);
  // 播放声音
  audio.play();
}

//单词详情
const choose = ref(false);
const wordBankVO = ref<WordListVO>()
//单词id
const DeleteRequest = {
  id: 0,
}
//查看单词详情
const onSelect = async (id: number) => {
  DeleteRequest.id = id;
  const res = await getWordDetails(DeleteRequest)
  if (res.code == 0) {
    wordBankVO.value = res.data;
    choose.value = true
  } else {
    message.error(res.message)
  }
}

//点击锚点，切换数据
const handleClick2: AnchorProps['onClick'] = (e, link) => {
  e.preventDefault();
};


const visible_password = ref(false)
const onUpdatePassword = () =>{
  visible_password.value = true;
  formState.id = loginUserInfo.value?.id as number;
}

</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  padding: 10px;
}

h6 {
  display: block;
  font-size: 0.67em;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>