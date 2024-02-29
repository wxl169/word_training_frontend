//统一管理咱们项目用户相关的接口
import request from "@/utils/request";
import type {
  WordListRequest,
  BaseResponseWordListVO,
  DeleteRequest,
  BaseResponseBoolean,
  WordUpdateRequest,
  BaseResponseWordByIdVO,
  BaseResponseWordBankListVO,
} from "./type";
//项目用户相关的请求地址
enum API {
  GET_WORD_LIST_URL = "/word/list/page",
  DELETE_URL = "/word/delete",
  UPLOAD_WORD_FILE = "/word/upload",
  UPDATE_WORD_URL = "/word/update",
  GET_WORD_BY_ID = "/word/get/id",
  GET_WORD_DETAILS = "/word/get/details",
  GET_WORD_BANK_LIST_URL = "/word/list/page/bank",
}

//管理员获取用户列表信息
export const getWordList = (data: WordListRequest) =>
  request.post<any, BaseResponseWordListVO>(API.GET_WORD_LIST_URL, data);

//管理员删除用户信息
export const deleteWord = (data: DeleteRequest) =>
  request.post<any, BaseResponseBoolean>(API.DELETE_URL, data);

//管理员上传单词信息
export const uploadWord = (data: File) =>
  request.post<any, BaseResponseBoolean>(API.UPLOAD_WORD_FILE, data);

//管理员修改单词信息
export const updateWord = (data: WordUpdateRequest) =>
  request.post<any, BaseResponseBoolean>(API.UPDATE_WORD_URL, data);

//获取某个单词的信息
export const getWordById = (data: DeleteRequest) =>
  request.post<any, BaseResponseWordByIdVO>(API.GET_WORD_BY_ID, data);

export const getWordDetails = (data: DeleteRequest) =>
  request.post<any, BaseResponseWordBankListVO>(API.GET_WORD_DETAILS, data);

//管理员获取用户列表信息
export const getWordBankList = (data: WordListRequest) =>
  request.post<any, BaseResponseWordBankListVO>(API.GET_WORD_BANK_LIST_URL, data);


