//标签参数类型
export type TagListVO = {
  id: number;
  tagName: string;
  createTime: Date;
  updateTime: Date;
};

//标签列表请求参数
export type TagListRequest = {
  tagName: string;
  current: number;
  pageSize: number;
};

//标签修改参数
export type TagUpdateRequest = {
  id: number;
  tagName: string;
}

//标签参数
export type TagVO = {
  id: number;
  tagName: string;
}


export type PageVO = {
  rows: [];
  total: number;
};

//删除参数类型
export type DeleteRequest = {
  id: number;
};

export type IdRequest = {
  id:number
}


// -----------------------------------返回数据类型------------------------------------

//管理员获取标签列表信息
export type BaseResponseTagListVO = {
  code?: number;
  data?: PageVO;
  message?: string;
};

//返回是否执行成功
export type BaseResponseTagVOList = {
  code?: number;
  data?: TagVO[];
  message?: string;
};

export type BaseResponseBoolean = {
  code?: number;
  data?: Boolean;
  message?: string;
};

