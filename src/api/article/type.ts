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
  cover_image: string;
  permissions: number;
};

//返回图片路径
export type BaseResponseString = {
  code?: number;
  data?: string;
  message?: string;
};
