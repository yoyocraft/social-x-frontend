export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },

  { path: '/', name: '首页', icon: 'home', component: './Ugc/Main' },

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

  // { path: '/article', name: '文章', icon: 'container', component: './Ugc/Main' },
  { path: '/post', name: '动态', icon: 'container', component: './Admin' },
  { path: '/question', name: '问答', icon: 'container', component: './Admin' },
  {
    path: '/article/:ugcId',
    name: '文章详情',
    hideInMenu: true,
    icon: 'container',
    component: './Ugc/Article',
  },

  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/config' },
      { path: '/admin/config', name: '配置管理', component: './Config/Center' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
