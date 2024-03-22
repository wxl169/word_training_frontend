//统一管理咱们项目用户相关的接口
import request from "@/utils/request";
import type { BaseResponseBoolean, CollectionGetRequest, CollectionRequest } from "./type";
import type { BaseResponsePageVO } from "../article/type";
//项目用户相关的请求地址
enum API {
  ADD_URL = "/collection/add",
  DELETE_URL = "/collection/delete",
  GET_BY_USER_ID = "/collection/get",
}

//用户收藏信息
export const addCollection = (data: CollectionRequest) =>
  request.post<any, BaseResponseBoolean>(API.ADD_URL, data);

//用户删除收藏信息
export const deleteCollection = (data: CollectionRequest) =>
  request.post<any, BaseResponseBoolean>(API.DELETE_URL, data);

  //用户获得自己收藏的内容信息
export const getCollectionByUserId = (data:CollectionGetRequest) =>
  request.post<any, BaseResponsePageVO>(API.GET_BY_USER_ID,data);