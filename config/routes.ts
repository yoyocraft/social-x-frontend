export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/account',
    routes: [
      { name: '个人中心', path: '/account/center', component: './User/Center' },
      { name: '个人设置', path: '/account/settings', component: './User/Settings' },
    ],
  },

  { path: '/', name: '首页', icon: 'home', component: './Welcome' },
  { path: '/article', name: '文章', icon: 'container', component: './Admin' },
  { path: '/post', name: '动态', icon: 'container', component: './Admin' },
  { path: '/question', name: '问答', icon: 'container', component: './Admin' },

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
