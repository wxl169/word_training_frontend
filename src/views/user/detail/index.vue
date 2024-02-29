<template>
  <!-- 个人信息 -->
  <a-card hoverable style="width: 100%; margin-top: 10px" title="个人信息">
    <template #extra>
      <!-- 用户信息修改 -->
      <div>
        <a-button type="primary" @click="onUpdate()">修改信息</a-button>
        <a-modal v-model:open="visible" title="个人信息修改" ok-text="确认" cancel-text="取消" @ok="onOk">
          <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">

            <a-form-item name="username" label="姓名" :rules="[{ required: true, message: '请输入您的用户名!' }]">
              <a-input v-model:value="formState.username" />
            </a-form-item>
            <a-form-item name="birthday" label="出生日期">
              <a-date-picker v-model:value="formState.birthday" value-format="YYYY-MM-DD" />
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
      </div>
    </template>
    <div class="space-align-block">
      <a-space align="center">
        <!-- 头像 -->
        <div class="avatar" style="margin-left: 500px;">
          <a-image :width="128" :src="loginUserInfo?.avatar" />
          <a-card-meta>
            <template #description>
              <div>
                <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">
                <a-button ghost style="color: black; margin-top: 10px; margin-left: 18px;"
                  @click="openFileInput">修改头像</a-button>
              </div>
            </template>
          </a-card-meta>
        </div>
        <!-- 个人详情 -->
        <a-descriptions :column="1" style="margin-left: 100px;">
          <a-descriptions-item label="账号">
            {{ loginUserInfo?.userAccount }}
          </a-descriptions-item>
          <a-descriptions-item label="姓名">
            {{ loginUserInfo?.username }}
          </a-descriptions-item>
          <a-descriptions-item label="出生日期">
            <span v-if="loginUserInfo?.birthday == null">请选择出生日期</span>
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
          <a-descriptions-item label="积分数">
            {{ loginUserInfo?.pointNumber }}
          </a-descriptions-item>
        </a-descriptions>
      </a-space>
    </div>
  </a-card>

  <!-- 在线天数 -->
  <a-card hoverable style="width: 100%; margin-top: 10px; display: flex; justify-content: center; align-items: center;">
    <h3 style="font-weight: bold; font-size: 24px; color: #78c2cf; text-shadow: 2px 2px 4px #c4c4e6;"> 🎉累计在线:{{
      loginUserInfo?.onlineDay }}天，当前已连续在线:{{ loginUserInfo?.coiledDay }}天，最近在线时间:{{
    formatTime2(loginUserInfo?.lastLoginTime) }} 🎉</h3>


  </a-card>
</template>

  
  
  

<script setup lang="ts">
import { getUserInfo, updateUserInfo, uploadImage } from '@/api/user';
import type { LoginUserVO } from '@/api/user/type';
import { onMounted, ref } from 'vue'
import { reactive, toRaw } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
const loginUserInfo = ref<LoginUserVO>();


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
}

const formRef = ref<FormInstance>();
const visible = ref(false);
//修改模块数据
const formState = reactive({
  id: 0,
  birthday: '',
  username: '',
  gender: 0,
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
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片');
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



</script>

<style scoped></style>