export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },

  { path: '/', name: '首页', icon: 'home', component: './Ugc/Article/Index' },

  {
    name: '个人中心',
    path: '/account/center',
    icon: 'user',
    hideInMenu: true,
    component: './User/Center',
  },
  {
    path: '/account/settings',
    name: '个人设置',
    icon: 'setting',
    component: './User/Settings',
    hideInMenu: true,
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
      {
        path: '/account/settings/notification',
        name: '消息设置',
        component: './User/Settings/NotificationSettings',
      },
    ],
  },

  { path: '/post', name: '动态', icon: 'container', component: './Ugc/Post/Index' },
  { path: '/question', name: '问答', icon: 'container', component: './Ugc/Question/Index' },
  {
    path: '/article/:ugcId',
    name: '文章详情',
    hideInMenu: true,
    component: './Ugc/Article/Detail',
  },
  {
    path: '/article/publish',
    name: '发布文章',
    hideInMenu: true,
    component: './Ugc/Article/Publish',
  },
  {
    path: '/post/publish',
    name: '发布帖子',
    hideInMenu: true,
    redirect: '/post',
  },
  {
    path: '/post/:ugcId',
    name: '帖子详情',
    hideInMenu: true,
    component: './Ugc/Post/Detail',
  },
  {
    path: '/question/publish',
    name: '提问题',
    hideInMenu: true,
    component: './Ugc/Question/Publish',
  },
  {
    path: '/question/:ugcId',
    name: '问题详情',
    hideInMenu: true,
    component: './Ugc/Question/Detail',
  },

  {
    path: '/notification',
    name: '通知',
    hideInMenu: true,
    redirect: '/notification/comment',
  },

  {
    path: '/notification/:type',
    name: '通知',
    hideInMenu: true,
    component: './Notification',
  },

  {
    path: '/search',
    name: '搜索页',
    hideInMenu: true,
    component: './Search',
  },

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
  { path: '*', layout: false, component: './404' },
];
