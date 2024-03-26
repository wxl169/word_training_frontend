import type { PageVO } from "../user/type";

export type CommentAddRequest = {
  content: string;
  parentId: number;
  topId: number;
  articleId: number;
  isTop: number;
};

export type CommentDeleteRequest = {
  userId:number
  commentId:number;
}

export type CommentListVO = {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  content: string;
  createTime: Date;
  parentId: number;
  topId: number;
  isSticky: number;
  praiseNumber: number;
  commentChildList: [];
  showForm:boolean
  articleId:number
};

export type CommentUserWriteRequest = {
  status:number;
  year:number;
  month:number;
  content:string;
  current:number;
}

export type CommentUserHomeVO={
  timeSet:[];
  pageVO:PageVO;
}

export type CommentUserVO = {
  id:number;//评论id
  userId:number; //评论用户id
  receiveUserId:number;//被评论用户id
  username:string;//被评论用户名
  content:string;//回复的评论内容
  receiveContent:string;//被回复的评论内容
  createTime:Date;//评论时间
  parentId:number;//父评论id
  articleId:number;//文章id
  articleUserId:number;//文章作者id
  articleUsername:string;//文章作者
  title:string;//文章标题
  praiseNumber:number;//点赞数
  reviewOpinions:string;//审核意见
  role:number;//角色 0：代表我是发送方，1：代表我是接收方
  status:number;//权限：0：我发表的评论，1：我回复的评论，2：回复我的评论，3：被封禁的评论
  showForm:boolean;//是否展示子回复框
}

export type BaseResponseCommentListVO = {
    code?: number;
    data?: CommentListVO[];
    message?: string;
  }

  export type BaseResponseCommentUserHomeVO = {
    code?: number;
    data?: CommentUserHomeVO;
    message?: string;
  }