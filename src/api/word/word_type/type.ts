

//单词类型参数类型
export type WordTypeListAllVO = {
  id: number;
  typeName: string;
  createTime: Date;
  updateTime: Date;
  childerWordTypeList:WordTypeListAllVO[];
};

//单词类型列表请求参数
export type WordTypeListRequest = {
  typeName: string;
  current: number;
  pageSize: number;
};

//管理员新增单词类型
export type WordTypeAddRequest = {
  typeName: string;
  isGroupName: number;
  id:number;
};

export type PageVO = {
  rows: [];
  total: number;
};

//删除参数类型
export type DeleteRequest = {
  id: number;
};

//用户修改需要参数ts的类型
export type WordTypeUpdateRequest = {
  id:number;
  typeGroupName : string;
  typeName :string;
  isGroupName : number;
  typeGroupId:number;
}

export type WordTypeListVO = {
  id: number;
  typeGroupName: string;
  childerWordTypeList:WordTypeListVO[];
}

export type WordTypeVO = {
  id:number;
  typeGroupName : string;
  typeName :string;
  isGroupName : number;
  typeGroupId:number;
  createTime:Date;
  updateTime:Date;
}

export type IdRequest = {
  id:number
}

export type WordTypeChilderListVO = {
  id: number;
  typeName: string;
}

// -----------------------------------返回数据类型------------------------------------

//管理员获取用户列表信息
export type BaseResponseWordTypeListVO = {
  code?: number;
  data?: PageVO;
  message?: string;
};

//返回是否执行成功
export type BaseResponseBoolean = {
  code?: number;
  data?: Boolean;
  message?: string;
};

export type BaseResponseWordTypeGroupAll = {
  code?: number;
  data?: WordTypeVO;
  message?: string;
};

//获取单词类型所有数据列表
export type BaseResponseGetWordTypeListVO = {
  code?: number;
  data?: WordTypeListVO[];
  message?: string;
};

//获取所有子类型数据列表
export type BaseResponseGetWordTypeChilderListVO = {
  code?: number;
  data?: WordTypeChilderListVO[];
  message?: string;
};

