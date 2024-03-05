//统一管理咱们项目用户相关的接口
import request from "@/utils/request";
import type { BaseResponseBoolean, PraiseRequest } from "./type";
//项目用户相关的请求地址
enum API {
  ADD_URL = "/praise/add",
  DELETE_URL = "/praise/delete",
}

//用户点赞信息
export const addPraise = (data: PraiseRequest) =>
  request.post<any, BaseResponseBoolean>(API.ADD_URL, data);

//用户删除点赞信息
export const deletePraise = (data: PraiseRequest) =>
  request.post<any, BaseResponseBoolean>(API.DELETE_URL, data);
