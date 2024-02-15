//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type {
UserLoginRequest,
BaseResponseLoginUserVO,
BaseResponseLong,
UserRegisterRequest,
} from './type'
//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/user/login',
  REGISTER_URL = '/user/register',
  GET_LOGIN_USER_INFO_URL = '/user/get/login',
  LOGOUT_URL = '/user/logout',
}




//登录接口
export const userLogin = (data: UserLoginRequest) =>
  request.post<any, BaseResponseLoginUserVO>(API.LOGIN_URL, data)

  //注册接口
export const userRegister = (data: UserRegisterRequest) =>
  request.post<any,BaseResponseLong>(API.REGISTER_URL,data)

//获取用户信息
export const getUserInfo = () =>
  request.get<any, BaseResponseLoginUserVO>(API.GET_LOGIN_USER_INFO_URL)

//退出登录
export const userLogout = () => request.post<any, any>(API.LOGOUT_URL)