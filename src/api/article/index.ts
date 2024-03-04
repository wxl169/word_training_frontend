//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type { ArticleAddRequest, ArticleListRequest, ArticleSelectRequest, ArticleUpdateReviewOpinionsRequest, BaseResponseArticleVO, BaseResponsePageVO, BaseResponseString } from './type'
import type { BaseResponseBoolean } from '../user/type'
import type { IdRequest } from '../tag/type';
//项目用户相关的请求地址
enum API {
  UPLOAD_IMAGE_URL = '/upload/article',
  ADD_URL= '/article/add',
  SELECT_ARTICLE_LIST_URL = '/article/page',
  UPDATE_ARTICLE_STATUS_URL = '/article/update/status',
  UPDATE_ARTICLE_REVIEWOPINIONS_URL = '/article/update/reviewOpinions',
  SELECT_ARTICLE_ID_URL = '/article/id',
  SELECT_ARTICLE_LIST_ALL_URL = 'article/get/all'
}


//修改用户图片
export const uploadImage = (data: File) => request.post<any, BaseResponseString>(API.UPLOAD_IMAGE_URL,data)

//上传文章信息
export const addArticle = (data:ArticleAddRequest) => request.post<any,BaseResponseBoolean>(API.ADD_URL,data);

//根据条件查询文章列表
export const selectArticleListVO = (data:ArticleListRequest) => request.post<any,BaseResponsePageVO>(API.SELECT_ARTICLE_LIST_URL,data);

//修改文章状态
export const updateArticleStatus = (data:IdRequest) => request.post<any,BaseResponseBoolean>(API.UPDATE_ARTICLE_STATUS_URL,data)

//修改文章回稿审核意见
export const updateArticleReviewOpinions = (data:ArticleUpdateReviewOpinionsRequest) => request.post<any,BaseResponseBoolean>(API.UPDATE_ARTICLE_REVIEWOPINIONS_URL,data)
//根据id搜索文章信息
export const selectArticleById = (data:IdRequest) => request.post<any,BaseResponseArticleVO>(API.SELECT_ARTICLE_ID_URL,data);
//查询文章列表信息展示
export const selectArticleListAll = (data:ArticleSelectRequest) =>request.post<any,BaseResponsePageVO>(API.SELECT_ARTICLE_LIST_ALL_URL,data);