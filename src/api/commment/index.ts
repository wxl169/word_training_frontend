//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type { BaseResponseBoolean } from '../user/type'
import type { IdRequest } from '../tag/type';
import type { BaseResponseCommentListVO, CommentAddRequest,CommentDeleteRequest } from './type';
//项目用户相关的请求地址
enum API {
  ADD_URL= '/comments/add',
  DELETE_URL= '/comments/delete',
  GET_COMMENT_ID_URL = '/comments/get/id',
}


//发布评论
export const addComment = (data:CommentAddRequest) => request.post<any,BaseResponseBoolean>(API.ADD_URL,data);

//评论列表
export const getCommentListVO = (data:IdRequest) => request.post<any,BaseResponseCommentListVO>(API.GET_COMMENT_ID_URL,data);

//删除评论
export const deleteComment = (data:CommentDeleteRequest) => request.post<any,BaseResponseBoolean>(API.DELETE_URL,data);

