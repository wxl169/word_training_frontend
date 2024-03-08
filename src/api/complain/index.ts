//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type { ComplainAddRequest } from './type'
import type { IdRequest } from '../tag/type'
import type { BaseResponseBoolean } from '../user/type'
//项目用户相关的请求地址
enum API {
  ADD_URL = '/complain/add',
}

//新增投诉
export const addComplain = (data: ComplainAddRequest) =>
  request.post<any, BaseResponseBoolean>(API.ADD_URL, data)

