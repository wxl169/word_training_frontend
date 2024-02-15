//封装：使用请求与响应拦截器
import axios from "axios";
import { message } from 'ant-design-vue';
import useUserStore from '@/store/modules/user'

//1. 利用axios对象的create方法，创建axios实例
let request = axios.create({
    baseURL : import.meta.env.VITE_APP_BASE_API,
    //基础路径
    timeout: 5000 //超时时间设置

});


//2. request实例添加请求与响应拦截器
request.interceptors.request.use((config) =>{
      //获取用户相关的小仓库:获取仓库内部token,登录成功以后携带给服务器
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.token = userStore.token
    }
        //config配置对象，headers属性请求头，经常给服务器携带公共参数
    //返回配置对象
    return config;
});


//3. 响应拦截器
request.interceptors.response.use((response) =>{
    //成功回调
    //简化数据
    return response.data;
},(error) =>{
    //失败回调:处理http网络错误
    let content = '';
    //http状态码
    let status = error.response.status;
    switch(status){
        case 401:
            content = "TOKEN过期"
            break;
        case 403:
            content = "无权访问"
            break;
        case 404:
            content = "请求地址错误"
            break;
        case 500:
            content = "服务器出现问题"
            break;
        default:
            content = "网络出现问题"
            break;
    }

    message.error(content,2);

    return Promise.reject(error);
});

export default request;