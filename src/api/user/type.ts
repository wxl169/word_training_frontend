//用户参数类型
export type UserType = {
  id: number,
  userAccount: string,
  phone: string,
  email: string,
  username: string,
  birthday: Date,
  gender: number,
  avatar: string,
  role: string,
  pointNumber: number,
  concern: String,
  coiledDay: number,
  onlineDay: number,
  lastLoginTime: Date,
  createTime: Date
}


//登录接口需要携带参数ts的类型
export type UserLoginRequest = {
    userAccount: string,
    userPassword: string,
}

//登录接口返回数据类型
export type LoginUserVO = {
    id: number,
    userAccount: string,
    username: string,
    avatar: string,
    role: string,
    pointNumber: number,
    coiledDay: number,
    onlineDay: number,
    lastLoginTime: Date,
    token: string,
}
//注册接口需要参数ts的类型
  export type UserRegisterRequest = {
    userAccount: string,
    userPassword: string,
    checkPassword: string,
}
//登录接口返回数据类型
  export type BaseResponseLoginUserVO = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

//注册接口返回数据类型
  export type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };
