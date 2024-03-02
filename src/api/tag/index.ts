//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type { BaseResponseBoolean, BaseResponseTagListVO, BaseResponseTagVOList, DeleteRequest, TagListRequest, TagUpdateRequest } from './type'
//项目用户相关的请求地址
enum API {
  GET_TAG_LIST_URL = '/tag/page',
  DELETE_URL = '/tag/delete',
  UPDATE_URL = '/tag/update',
  ADD_URL = '/tag/add',
  GET_TAG_VO_LIST_URL = '/tag/list',
}




//管理员获取标签列表信息
export const getTagListPage = (data: TagListRequest) => request.post<any, BaseResponseTagListVO>(API.GET_TAG_LIST_URL,data);

//管理员删除标签信息
export const deleteTag = (data: DeleteRequest) => request.post<any, BaseResponseBoolean>(API.DELETE_URL,data)
//管理员修改标签信息
export const updateTag = (data: TagUpdateRequest) => request.post<any, BaseResponseBoolean>(API.UPDATE_URL,data)
//管理员新增标签信息
export const addTag = (tagName: string) => request.get<any, BaseResponseBoolean>(API.ADD_URL, { params: { tagName } });
//用户获取所有标签
export const getTagVOListAll =() => request.get<any,BaseResponseTagVOList>(API.GET_TAG_VO_LIST_URL);

// //所有用户获取单词类型列表
// export const getWordTypeListVO = () => request.get<any, BaseResponseGetWordTypeListVO>(API.GET_WORD_TYPE_LIST_VO_URL)

// //获取所有类型组
// export const getWordTypeGroupAll = () => request.get<any,BaseResponseWordTypeGroupAll>(API.GET_WORD_TYPE_GROUP_ALL_URL)

// //根据id获取类型信息
// export const getWordTypeByOne = (data:IdRequest) => request.post<any,BaseResponseWordTypeGroupAll>(API.GET_WORD_TYPE_ONE_URL,data);

// //获取所有子类型信息
// export const getWordTypeChilderList = () => request.get<any,BaseResponseGetWordTypeChilderListVO>(API.GET_WORD_TYPE_LIST_ALL_URL);