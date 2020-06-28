const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: { title: '工作台' } },
      {
        path: '/me/org',
        component: () => import('pages/me/org.vue'),
        meta: { title: '我的组织' }
      },
      {
        path: '/me/groups',
        component: () => import('pages/me/groups.vue'),
        meta: { title: '我的群组' }
      },
      {
        path: '/collection/list',
        component: () => import('pages/collection/list.vue'),
        meta: { title: '收集列表' }
      }
    ]
  },

  {
    path: '/register',
    component: () => import('pages/register/index.vue'),
    meta: { isPublic: true, title: '注册' }
  },

  {
    path: '/login',
    component: () => import('pages/login/index.vue'),
    meta: { isPublic: true, title: '登录' }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
