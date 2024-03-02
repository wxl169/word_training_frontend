//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type {
    WordTypeListRequest,
    BaseResponseWordTypeListVO,
    DeleteRequest,
    BaseResponseBoolean,
    WordTypeUpdateRequest,
    WordTypeAddRequest,
    BaseResponseGetWordTypeListVO,
    BaseResponseWordTypeGroupAll,
    IdRequest,
    BaseResponseGetWordTypeChilderListVO
} from './type'
//项目用户相关的请求地址
enum API {
  GET_WORD_TYPE_LIST_URL = '/word_type/list/page',
  DELETE_URL = '/word_type/delete',
  UPDATE_URL = '/word_type/update',
  ADD_URL = '/word_type/add',
  GET_WORD_TYPE_LIST_ALL_URL= '/word_type/list',
  GET_WORD_TYPE_LIST_VO_URL = '/word_type/get',
  GET_WORD_TYPE_GROUP_ALL_URL = '/word_type/get/group',
  GET_WORD_TYPE_ONE_URL = '/word_type/get/one',
}




//管理员获取单词类型列表信息
export const getWordTypeList = (data: WordTypeListRequest) => request.post<any, BaseResponseWordTypeListVO>(API.GET_WORD_TYPE_LIST_URL,data)

//管理员删除单词类型信息
export const deleteWordType = (data: DeleteRequest) => request.post<any, BaseResponseBoolean>(API.DELETE_URL,data)
//管理员修改单词类型信息
export const updateWordType = (data: WordTypeUpdateRequest) => request.post<any, BaseResponseBoolean>(API.UPDATE_URL,data)
//管理员新增单词类型信息
export const addWordType = (data: WordTypeAddRequest) => request.post<any, BaseResponseBoolean>(API.ADD_URL,data)

//所有用户获取单词类型列表
export const getWordTypeListVO = () => request.get<any, BaseResponseGetWordTypeListVO>(API.GET_WORD_TYPE_LIST_VO_URL)

//获取所有类型组
export const getWordTypeGroupAll = () => request.get<any,BaseResponseWordTypeGroupAll>(API.GET_WORD_TYPE_GROUP_ALL_URL)

//根据id获取类型信息
export const getWordTypeByOne = (data:IdRequest) => request.post<any,BaseResponseWordTypeGroupAll>(API.GET_WORD_TYPE_ONE_URL,data);

//获取所有子类型信息
export const getWordTypeChilderList = () => request.get<any,BaseResponseGetWordTypeChilderListVO>(API.GET_WORD_TYPE_LIST_ALL_URL);