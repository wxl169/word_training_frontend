//创建用户相关的小仓库
import { defineStore } from "pinia";
import { userLogin, getUserInfo,userLogout } from "@/api/user";
import type { UserLoginRequest,BaseResponseLoginUserVO } from "@/api/user/type";
import type { UserState } from "./types/type";
//引入路由（常量路由）
import {constantRoute} from '@/router/routes';
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'

//创建用户小仓库
const userUserStore = defineStore('user',{
    //小仓库存储数据地方
    state: () : UserState => {
        return {
            token: GET_TOKEN(),//用户唯一标识token
            menuRoutes: constantRoute,//仓库存储生产菜单需要的数组
            username : '',
            avatar : '',
            role: '',
            userId:0,

        }
    },
    actions: {
        //用户登录的方法
       async userLogin(data: UserLoginRequest){
            let result:BaseResponseLoginUserVO = await userLogin(data);
            //登录请求：成功0 ->token
            if(result.code == 0){
                this.token = result.data?.token as string;
                //本地存储持久化存储一份
                SET_TOKEN(result.data?.token as string)
                //保证当前async函数返回一个成功的promise
                return 'ok';
            } else{
                return Promise.reject(new Error(result.message))
            }
            //登录请求：失败抛出异常，登录失败错误信息
        },

        //获取用户信息方法
        async userInfo() {
            //获取用户信息进行存储仓库当中[用户头像、名字]
            const result: BaseResponseLoginUserVO = await getUserInfo()
            //如果获取用户信息成功，存储一下用户信息
            if (result.code == 0) {
              this.username = result.data?.username as string;
              this.avatar = result.data?.avatar as string;
              this.role = result.data?.role as string;
              this.userId = result.data?.id as number;
            //   //计算当前用户需要展示的异步路由
            //   const userAsyncRoute = filterAsyncRoute(
            //     cloneDeep(asnycRoute),
            //     result.data.routes,
            //   )
            //   //菜单需要的数据整理完毕
            //   this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
            //   //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
            //   ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
            //     router.addRoute(route)
            //   })
              return 'ok'
            } else {
              return Promise.reject(new Error(result.message))
            }
          },
          
          //退出登录
        async userLogout() {
        //退出登录请求
            const result: any = await userLogout()
            if (result.code == 0) {
            //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
                 this.token = ''
                this.username = ''
                this.avatar = ''
                this.role = ''
                REMOVE_TOKEN()
                return 'ok'
             }  else {
                return Promise.reject(new Error(result.message))
             }
         },
    },
    getters: {

    }
})

export default userUserStore;