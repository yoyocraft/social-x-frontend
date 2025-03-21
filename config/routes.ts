// 定义路由配置
const routes = [
  // 登录路由 - 无布局
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },

  // 主导航路由
  {
    path: '/',
    name: '首页',
    icon: 'home',
    component: './Ugc/Article/Index',
  },
  {
    path: '/post',
    name: '动态',
    icon: 'container',
    component: './Ugc/Post/Index',
  },
  {
    path: '/question',
    name: '问答',
    icon: 'QuestionCircle',
    component: './Ugc/Question/Index',
  },

  // 用户中心相关路由
  {
    name: '用户相关',
    path: '/account',
    hideInMenu: true,
    routes: [
      {
        name: '个人中心',
        path: '/account/center',
        icon: 'user',
        component: './User/Center',
      },
      {
        path: '/account/settings',
        name: '个人设置',
        icon: 'setting',
        component: './User/Settings',
        routes: [
          {
            path: '/account/settings/profile',
            name: '个人资料',
            component: './User/Settings/ProfileSettings',
          },
          {
            path: '/account/settings/account',
            name: '账号资料',
            component: './User/Settings/AccountSettings',
          },
        ],
      },
    ],
  },

  // 用户信息路由
  {
    name: '用户信息',
    path: '/user/:userId',
    icon: 'user',
    hideInMenu: true,
    component: './User/Center',
  },

  // 内容相关路由
  {
    name: '内容相关',
    hideInMenu: true,
    routes: [
      // 文章相关
      {
        path: '/article/:ugcId',
        name: '文章详情',
        component: './Ugc/Article/Detail',
      },
      {
        path: '/article/publish',
        name: '发布文章',
        component: './Ugc/Article/Publish',
      },
      {
        path: '/article/edit/:ugcId',
        name: '编辑文章',
        component: './Ugc/Article/Publish',
      },

      // 动态相关
      {
        path: '/post/publish',
        name: '发布帖子',
        redirect: '/post',
      },
      {
        path: '/post/:ugcId',
        name: '帖子详情',
        component: './Ugc/Post/Detail',
      },

      // 问答相关
      {
        path: '/question/publish',
        name: '提问题',
        component: './Ugc/Question/Publish',
      },
      {
        path: '/question/:ugcId',
        name: '问题详情',
        component: './Ugc/Question/Detail',
      },
    ],
  },

  // 通知相关路由
  {
    name: '通知相关',
    hideInMenu: true,
    routes: [
      {
        path: '/notification',
        name: '通知',
        redirect: '/notification/comment',
      },
      {
        path: '/notification/:type',
        name: '通知详情',
        component: './Notification',
      },
    ],
  },

  // 搜索页面
  {
    path: '/search',
    name: '搜索页',
    hideInMenu: true,
    component: './Search',
  },

  // 管理员路由
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/config' },
      { path: '/admin/config', name: '配置管理', component: './Admin/Config' },
      { path: '/admin/notification', name: '通知管理', component: './Admin/Notification' },
    ],
  },

  // 404页面
  {
    path: '*',
    layout: false,
    component: './404',
  },
];

export default routes;
