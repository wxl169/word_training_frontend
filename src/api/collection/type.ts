export type CollectionRequest = {
  id: number;
  type: number;
};

export type CollectionGetRequest = {
  type:number;//0：文章，1：单词
  pageSize:number;
  current:number;
}

export type CollectionGetVO = {
  collectionId:number;
  title:string;
  isCollection:number;
  word:string;
  translation:string[];
  pronounceEnglish:string;
  pronounceAmerica:string;
}

// -----------------------------------返回数据类型------------------------------------

//返回是否执行成功
export type BaseResponseBoolean = {
  code?: number;
  data?: Boolean;
  message?: string;
};

