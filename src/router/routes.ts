//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
export const constantRoute = [
  //登录
  {
    path: "/login",
    component: () => import("@/views/user/login/index.vue"),
    name: "login",
    meta: {
      title: "登录", //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
    },
  },

  //注册
  {
    path: "/register",
    component: () => import("@/views/user/register/index.vue"),
    name: "register",
    meta: {
      title: "注册", //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
    },
  },

  //个人详情
  {
    path: "/layout/detail",
    component: () => import("@/layout/index.vue"),
    name: "layout_detail",
    meta: {
      title: "", //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: "",
    },
    redirect: "/user/detail",
    children: [
      {
        path: "/user/detail",
        name: "user_detail",
        component: () => import("@/views/user/detail/index.vue"),
        meta: {
          title: "个人信息", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
    ],
  },

  //首页
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    name: "layout",
    meta: {
      title: "", //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: "",
    },
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
    ],
  },

  //单词训练
  {
    path: "/word",
    component: () => import("@/layout/index.vue"),
    name: "layout_word",
    meta: {
      title: "", //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: "",
    },
    redirect: "/word/training",
    children: [
      {
        path: "/word/training",
        name: "word_training",
        component: () => import("@/views/word_training/index.vue"),
        meta: {
          title: "单词训练", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
      {
        path: "/word/training/modeSelect",
        name: "mode_select",
        component: () =>
          import("@/views/word_training/mode_selection/index.vue"),
        meta: {
          title: "模式选择", //菜单标题
          hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
      {
        path: "/word/training/trainingBegin",
        name: "training_begin",
        component: () =>
          import("@/views/word_training/training_begin/index.vue"),
        meta: {
          title: "训练开始", //菜单标题
          hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
      {
        path: "/word/training/typeSelection",
        name: "type_selection",
        component: () =>
          import("@/views/word_training/type_selection/index.vue"),
        meta: {
          title: "类别选择", //菜单标题
          hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
    ],
  },

  //单词库
  {
    path: "/bank",
    component: () => import("@/layout/index.vue"),
    name: "layout_word_bank",
    meta: {
      title: "", //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: "",
    },
    redirect: "/word/bank",
    children: [
      {
        path: "/word/bank",
        name: "word_bank",
        component: () => import("@/views/word_bank/index.vue"),
        meta: {
          title: "单词库", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
      {
        path: "/word/bank/error",
        name: "word_bank_error",
        component: () => import("@/views/word_bank/error_word/index.vue"),
        meta: {
          title: "错题库", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
    ],
  },

  //社区
  {
    path: "/article",
    component: () => import("@/layout/index.vue"),
    name: "layout_article",
    meta: {
      title: "", //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: "",
    },
    redirect: "/article/home",
    children: [
      {
        path: "/article/home",
        name: "article_home",
        component: () => import("@/views/article/index.vue"),
        meta: {
          title: "社区", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
      {
        path: "/article/write",
        name: "article_write",
        component: () => import("@/views/article/article_write/index.vue"),
        meta: {
          title: "分享文章", //菜单标题
          hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
        },
      },
    ],
  },

  //系统管理
  {
    path: "/system",
    component: () => import("@/layout/index.vue"),
    name: "systemManage",
    meta: {
      title: "系统管理",
      hidden: false,
      icon: "LockOutlined",
    },
    redirect: "/system/user",
    children: [
      {
        path: "/system/user",
        name: "system_user",
        component: () => import("@/views/system_manage/user/index.vue"),
        meta: {
          title: "用户管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "UserOutlined",
        },
      },
      {
        path: "/system/word",
        name: "system_word",
        component: () => import("@/views/system_manage/word/index.vue"),
        meta: {
          title: "单词管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "ReadOutlined",
        },
      },
      {
        path: "/system/wordType",
        name: "system_word_type",
        component: () => import("@/views/system_manage/word_type/index.vue"),
        meta: {
          title: "单词类型管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "HomeOutlined",
        },
      },
      {
        path: "/system/article",
        name: "system_article",
        component: () => import("@/views/system_manage/article/index.vue"),
        meta: {
          title: "文章管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "HomeOutlined",
        },
      },
      {
        path: "/system/tag",
        name: "system_tag",
        component: () => import("@/views/system_manage/tag/index.vue"),
        meta: {
          title: "标签管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "HomeOutlined",
        },
      },
      {
        path: "/system/task",
        name: "system_task",
        component: () => import("@/views/system_manage/task/index.vue"),
        meta: {
          title: "任务管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "HomeOutlined",
        },
      },
      {
        path: "/system/medal",
        name: "system_medal",
        component: () => import("@/views/system_manage/medal/index.vue"),
        meta: {
          title: "勋章管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "HomeOutlined",
        },
      },
      {
        path: "/system/complain",
        name: "system_complain",
        component: () => import("@/views/system_manage/complain/index.vue"),
        meta: {
          title: "投诉管理", //菜单标题
          hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
          icon: "HomeOutlined",
        },
      },
    ],
  },

  //404
  {
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      title: "404",
      hidden: true,
    },
  },

  //任意路由
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "Any",
    meta: {
      title: "任意路由",
      hidden: true,
    },
  },
];
