//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type {
UserLoginRequest,
BaseResponseLoginUserVO,
BaseResponseLong,
UserRegisterRequest,
UserListRequest,
BaseResponseUserListVO,
DeleteRequest,
BaseResponseBoolean,
UserUpdateRequest,
UserUpdateByUserRequest,
BaseResponseString,
} from './type'
//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/user/login',
  REGISTER_URL = '/user/register',
  GET_LOGIN_USER_INFO_URL = '/user/get/login',
  LOGOUT_URL = '/user/logout',
  GET_USER_LIST_URL = '/user/list/page',
  DELETE_URL = '/user/delete',
  UPDATE_URL = '/user/update',
  UPDATE_BY_USER_URL = '/user/update/all',
  UPLOAD_IMAGE_URL = '/upload',
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

//管理员获取用户列表信息
export const getUserList = (data: UserListRequest) => request.post<any, BaseResponseUserListVO>(API.GET_USER_LIST_URL,data)

//管理员删除用户信息
export const deleteUser = (data: DeleteRequest) => request.post<any, BaseResponseBoolean>(API.DELETE_URL,data)

//管理员修改用户信息
export const updateUser = (data: UserUpdateRequest) => request.post<any, BaseResponseBoolean>(API.UPDATE_URL,data)

//用户修改自己的信息
export const updateUserInfo = (data: UserUpdateByUserRequest) => request.post<any, BaseResponseBoolean>(API.UPDATE_BY_USER_URL,data)

//修改用户图片
export const uploadImage = (data: File) => request.post<any, BaseResponseString>(API.UPLOAD_IMAGE_URL,data)

