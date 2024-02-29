//统一管理咱们项目用户相关的接口
import request from "@/utils/request";
import type { BaseResponseBoolean, CollectionRequest } from "./type";
//项目用户相关的请求地址
enum API {
  ADD_URL = "/collection/add",
  DELETE_URL = "/collection/delete",
}

//用户收藏信息
export const addCollection = (data: CollectionRequest) =>
  request.post<any, BaseResponseBoolean>(API.ADD_URL, data);

//用户删除收藏信息
export const deleteCollection = (data: CollectionRequest) =>
  request.post<any, BaseResponseBoolean>(API.DELETE_URL, data);
