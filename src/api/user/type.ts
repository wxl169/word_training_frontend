//用户参数类型
export type UserType = {
  id: number,
  userAccount: string,
  userPassword: string,
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

//删除参数类型
export type DeleteRequest = {
  id: number;
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
    birthday: Date,
    gender: number,
    avatar: string,
    role: string,
    pointNumber: number,
    coiledDay: number,
    onlineDay: number,
    lastLoginTime: Date,
    token: string,
}

//管理员获取用户信息的条件
export type UserListRequest = {
   current : number,
   pageSize : number,
   userAccount?: string,
   username?: string,
   gender?: number,
   role?: string
}

//管理员获取用户脱敏后的信息
export type UserListVO = {
  id: number,
  userAccount: string,
  username: string,
  birthday: Date,
  gender: number,
  avatar: string,
  role: string,
  pointNumber: number,
  coiledDay: number,
  onlineDay: number,
  lastLoginTime: Date,
  createTime: Date
}

//注册接口需要参数ts的类型
  export type UserRegisterRequest = {
    userAccount: string,
    userPassword: string,
    checkPassword: string,
}


export type PageVO ={
  rows:[],
  total: number
}

//用户修改需要参数ts的类型
export type UserUpdateRequest = {
  id: number,
  role: string,
}

//用户修改自己的信息参数类型
export type UserUpdateByUserRequest = {
  id: number,
  birthday: Date,
  username: string,
  gender: number,
}


// -----------------------------------返回数据类型------------------------------------

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

  //管理员获取用户列表信息
  export type BaseResponseUserListVO = {
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


    //返回是否执行成功
    export type BaseResponseString = {
      code?: number;
      data?: string;
      message?: string;
    }