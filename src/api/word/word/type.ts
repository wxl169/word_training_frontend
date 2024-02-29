//管理员获取单词信息的条件
export type WordListRequest = {
    current : number,
    pageSize : number,
    word?: string,
    translation?: string,
    type?: string[],
 }


//管理员获取单词脱敏后的信息
export type WordListVO = {
  id: number;
  word: string;
  translation: string[];
  type: string[];
  image: string;
  example: Map<string,string>;
  pronounceEnglish: string;
  pronounceAmerica: string;
  synonym: string[];
  antonym: string[];
  exchange: Map<string,string>;
};

export type PageVO = {
  rows: [];
  total: number;
};

//删除参数类型
export type DeleteRequest = {
    id: number;
  }

export type WordUpdateRequest = {
  id: number;
  word: string;
  translation: string;
  type: string[];
  image: string;
  example: string;
  pronounceEnglish: string;
  pronounceAmerica: string;
  synonym: string;
  antonym: string;
  exchange: string;
}

export type WordByIdVO = {
  id: number;
  word: string;
  translation: string;
  type: string[];
  image: string;
  example: string;
  pronounceEnglish: string;
  pronounceAmerica: string;
  synonym: string;
  antonym: string;
  exchange: string;
}

export type WordBankListVO = {
  id: number;
  word: string;
  translation: string;
  type: string[];
  pronounceAmerica: string;
  pronounceEnglish:string;
  isCollection: boolean;
}

// -----------------------------------返回数据类型------------------------------------

//管理员获取用户列表信息
export type BaseResponseWordListVO = {
  code?: number;
  data?: PageVO;
  message?: string;
};

  //返回是否执行成功
  export type BaseResponseBoolean = {
    code?: number;
    data?: Boolean;
    message?: string;
  }

  export type BaseResponseWordByIdVO = {
    code?: number;
    data?: WordByIdVO;
    message?: string;
  }

  export type BaseResponseWordBankVO = {
    code?: number;
    data?: WordListVO;
    message?: string;
  }

  export type BaseResponseWordBankListVO = {
    code?: number;
    data?: WordBankListVO;
    message?: string;
  }