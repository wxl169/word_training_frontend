//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type { ArticleAddRequest, BaseResponseString } from './type'
import type { BaseResponseBoolean } from '../user/type'
//项目用户相关的请求地址
enum API {
  UPLOAD_IMAGE_URL = '/upload/article',
  ADD_URL= '/article/add'
}


//修改用户图片
export const uploadImage = (data: File) => request.post<any, BaseResponseString>(API.UPLOAD_IMAGE_URL,data)

//上传文章信息
export const addArticle = (data:ArticleAddRequest) => request.post<any,BaseResponseBoolean>(API.ADD_URL,data);