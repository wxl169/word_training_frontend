//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type { BaseResponseBoolean } from '../user/type'
import type { IdRequest } from '../tag/type';
import type { BaseResponseCommentListVO, BaseResponseCommentUserHomeVO, CommentAddRequest,CommentDeleteRequest, CommentUserWriteRequest } from './type';
import type { BaseResponsePageVO } from '../article/type';
//项目用户相关的请求地址
enum API {
  ADD_URL= '/comments/add',
  ADD_REPLY_URL= '/comments/add/reply',
  DELETE_URL= '/comments/delete',
  GET_COMMENT_ID_URL = '/comments/get/id',
  GET_COMMENT_USER_HOME_URL = '/comments/get/user',
  GET_COMMENT_USER_HOME__PAGE_URL = '/comments/get/page',
}


//发布评论
export const addComment = (data:CommentAddRequest) => request.post<any,BaseResponseBoolean>(API.ADD_URL,data);

//评论列表
export const getCommentListVO = (data:IdRequest) => request.post<any,BaseResponseCommentListVO>(API.GET_COMMENT_ID_URL,data);

//删除评论
export const deleteComment = (data:CommentDeleteRequest) => request.post<any,BaseResponseBoolean>(API.DELETE_URL,data);

//获取用户发布的评论首页信息
export const getCommentUserHome = () => request.post<any,BaseResponseCommentUserHomeVO>(API.GET_COMMENT_USER_HOME_URL);
//根据条件获取用户发布的评论信息
export const getCommentUserVoList = (data:CommentUserWriteRequest) => request.post<any,BaseResponsePageVO>(API.GET_COMMENT_USER_HOME__PAGE_URL,data);

export const addCommentReply = (data:CommentAddRequest) => request.post<any,BaseResponseBoolean>(API.ADD_REPLY_URL,data);

