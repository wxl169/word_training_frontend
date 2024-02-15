<template>
  <div class="login_container">
    <a-form :model="userLoginRequest" name="normal_login" class="login-form" @finish="onFinish"
      @finishFailed="onFinishFailed" :rules="rules">
      <div class="login_form2">
        <h1>Hello</h1>
        <h2>欢迎来到英语单词训练系统</h2>
        <a-form-item label="账号" name="userAccount">
          <a-input v-model:value="userLoginRequest.userAccount" class="login_input">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="userPassword">
          <a-input-password v-model:value="userLoginRequest.userPassword" class="login_input">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>
        <a class="login-form-forgot" href="">忘记密码</a>
      </a-form-item> -->

        <a-form-item>
          <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" :loading="loading">
            登录
          </a-button>
        </a-form-item>
        <router-link :to="{name:'register'}">注册账号</router-link>
      </div>

    </a-form>
  </div>
</template>


<script lang="ts" setup>
import { reactive, computed, ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { UserLoginRequest } from '@/api/user/type';
import type { Rule } from 'ant-design-vue/es/form';
import useUserStore from '@/store/modules/user';
import { useRouter ,useRoute} from 'vue-router';
import message from 'ant-design-vue/es/message';




const userLoginRequest = reactive<UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});
let useStore = useUserStore();
let $router = useRouter();
let loading = ref(false);
//路由对象
let $route = useRoute();
//判断账号密码格式
const rules: Record<string, Rule[]> = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'change' },
    { min: 8, max: 10, message: '账号长度为8-10位', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 8, max: 16, message: '密码长度为8-16位', trigger: 'blur' }
  ],
};


const onFinish = async (values: any) => {
  //加载效果：开始加载
  loading.value = true;
  try {
    await useStore.userLogin(values);
  //判断登录的时候,路由路径当中是否有query参数，如果有就往query参数挑战，没有跳转到首页
    let redirect: any = $route.query.redirect;
    $router.push({ path: redirect || '/' });
    message.success("登录成功", 2);
    //登录成功加载效果消失
    loading.value = false;
  } catch (error) {
    message.error("请检查账号密码是否正确", 2)
    //登录失败加载效果消失
    loading.value = false;
    
  }

};

//表单数据错误执行
const onFinishFailed = (errorInfo: any) => {
  message.error("请检查账号密码长度是否符合要求", 2)
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(userLoginRequest.userAccount && userLoginRequest.userPassword);
});


</script>


<style scoped>
body {
  margin: 0;

}

.login_container {
  width: 100%;
  height: 100%;
  position: fixed;
  background: url('@/assets/images/background.png') no-repeat;
  background-size: cover;
}

.login-form {     
    max-width: 500px;
    margin-left: 35%;
    margin-top: 8%;
    border-radius: 10px;
    background-color:rgba(121, 177, 189, 0.2); 
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}

.login_form2 {
  padding: 10px;
  margin: 0 50px 0 50px;
}

.login_input {
  max-width: 300px;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}

h1 {
  color: black;
}

h2 {
  color: black;
}

.register {
  color: rgb(8, 81, 154);
}</style>

