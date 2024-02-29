export type CollectionRequest = {
  id: number;
  type: number;
};

// -----------------------------------返回数据类型------------------------------------

//返回是否执行成功
export type BaseResponseBoolean = {
  code?: number;
  data?: Boolean;
  message?: string;
};

