import type { PageVO } from "../user/type";

export type ArticleSelectRequest = {
  tagName: [];
  content: string;
  current: number;
  pageSize: number;
};

export type ArticleAddRequest = {
  title: string;
  content: string;
  description: string;
  tags: string[];
  coverImage: string;
  permissions: number;
};
export type ArticleListVO = {
  id:number;
  title:string;
  content: string;
  userId:string;
  userAccount:string;
  description:string;
  visitNumber:number;
  praiseNumber:number;
  commentNumber:number;
  collectionNumber:number;
  tags:string[];
  coverImage:string;
  status:number;
  permissions:number;
  reviewOpinions:string;
  createTime:Date;
  updateTime:Date;
}

export type ArticleListRequest = {
  userAccount:string;
  content:string;
  tags:string[]
  status:number;
  permissions:number;
  current:number;
  pageSize:number;
}

export type ArticleVO = {
  id:number;
  title:string;
  content: string;
  userId:string;
  username:string;
  description:string;
  visitNumber:number;
  praiseNumber:number;
  commentNumber:number;
  collectionNumber:number;
  tags:string[];
  coverImage:string;
  status:number;
  permissions:number;
  reviewOpinions:string;
  createTime:Date;
  updateTime:Date;
}

export type ArticleUpdateReviewOpinionsRequest ={
  id:number;
  reviewOpinions:string;
}

// -----------------------------------------------返回结果---------------------------------------
//返回图片路径
export type BaseResponseString = {
  code?: number;
  data?: string;
  message?: string;
};

export type BaseResponsePageVO = {
  code?: number;
  data?: PageVO;
  message?: string;
};

export type BaseResponseArticleVO = {
  code?: number;
  data?: ArticleListVO;
  message?: string;
};
