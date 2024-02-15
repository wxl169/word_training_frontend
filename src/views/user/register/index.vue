<template>
    <div class="register_container">
      <a-form :model="userRegisterRequest" name="normal_register" class="register-form" @finish="onFinish"
        @finishFailed="onFinishFailed" :rules="rules">
        <div class="register_form2">
          <h1>欢迎注册本英语单词训练系统</h1>
          <h2>学然后知不足。</h2>
          <a-form-item label="账号" name="userAccount">
            <a-input v-model:value="userRegisterRequest.userAccount" class="register_input">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
  
          <a-form-item label="密码" name="userPassword">
            <a-input-password v-model:value="userRegisterRequest.userPassword" class="register_input">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item label="确认密码" name="checkPassword">
            <a-input-password v-model:value="userRegisterRequest.checkPassword" class="register_input">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          
          <a-form-item>
            <a-button :disabled="disabled" type="primary" html-type="submit" class="register-form-button" :loading="loading">
              注册
            </a-button>
          </a-form-item>
          <router-link :to="{name:'login'}">已有账号，前往登录</router-link>
        </div>
      </a-form>
    </div>
  </template>
  
  
  <script lang="ts" setup>
  import { reactive, computed, ref } from 'vue';
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
  import type { UserRegisterRequest } from '@/api/user/type';
  import type { Rule } from 'ant-design-vue/es/form';
  import { useRouter } from 'vue-router';
  import message from 'ant-design-vue/es/message';
  import {userRegister} from '@/api/user/index';
  
  const userRegisterRequest = reactive<UserRegisterRequest>({
    userAccount: '',
    userPassword: '',
    checkPassword: '',
  });
  
  let $router = useRouter();
  let loading = ref(false);

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
    checkPassword: [
      { required: true, message: '请再次输入密码', trigger: 'change' },
      { min: 8, max: 16, message: '密码长度为8-16位', trigger: 'blur' }
    ],
  };
  
  
  const onFinish = async (values: any) => {
    //加载效果：开始加载
    loading.value = true;
    const res = await userRegister(values);

    if (res?.code === 0) {
        message.success('注册成功',2);
        userRegisterRequest.userAccount = '';
        userRegisterRequest.userPassword = '';
        userRegisterRequest.checkPassword = '';
        loading.value = false;

    } else {
        if (res.message == "") {
            message.error("注册失败!",2);
        } else {
          message.error(res.message,2)
        }
        loading.value = false;
    }

    //   loading.value = false;
  };
  
  //表单数据错误执行
  const onFinishFailed = (errorInfo: any) => {
    message.error("请检查账号密码是否符合条件", 2)
    console.log('Failed:', errorInfo);
  };
  const disabled = computed(() => {
    return !(userRegisterRequest.userAccount && userRegisterRequest.userPassword && userRegisterRequest.checkPassword);
  });

  
  
  </script>
  
  
  <style scoped>
  body {
    margin: 0;
  
  }
  
  .register_container {
    width: 100%;
    height: 100%;
    position: fixed;
    background: url('@/assets/images/background.png') no-repeat;
    background-size: cover;
  }
  
  .register-form {     
      max-width: 500px;
      margin-left: 35%;
      margin-top: 8%;
      border-radius: 10px;
      background-color:rgba(121, 177, 189, 0.2); 
      box-shadow: 0 0 10px rgba(0, 0, 0, .2);
  }
  
  .register_form2 {
    padding: 10px;
    margin: 0 50px 0 50px;
  }
  
  .register_input {
    max-width: 300px;
  }
  
  .register-form-forgot {
    float: right;
  }
  
  .register-form-button {
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
  
  