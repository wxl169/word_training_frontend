export type CommentAddRequest = {
  content: string;
  parentId: number;
  topId: number;
  articleId: number;
  isTop: number;
};

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
};


export type BaseResponseCommentListVO = {
    code?: number;
    data?: CommentListVO[];
    message?: string;
  }