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
        path: '/me/posts',
        component: () => import('pages/me/posts.vue'),
        meta: { title: '我的文件' }
      },
      {
        path: '/me/settings',
        component: () => import('pages/me/profile.vue'),
        meta: { title: '个人设置' }
      },
      {
        path: '/me/collections',
        component: () => import('pages/collection/myCollections.vue'),
        props: true,
        meta: { title: '我的收集' }
      },
      {
        path: '/collections/myTasks',
        component: () => import('pages/collection/myTasks.vue'),
        meta: { title: '我的任务' }
      },
      {
        path: '/collections/create',
        component: () => import('pages/collection/create.vue'),
        meta: { title: '创建收集' }
      },
      {
        path: '/collections/edit/:id',
        component: () => import('pages/collection/edit.vue'),
        props: true,
        meta: { title: '修改收集' }
      },
      {
        path: '/collections/:id',
        component: () => import('pages/collection/view.vue'),
        props: true,
        meta: { title: '查看收集' }
      },
      {
        path: '/collections/subInfo/:id',
        component: () => import('pages/collection/cltSubInfo.vue'),
        props: true,
        meta: { title: '提交详情' }
      },
      {
        path: '/groups/:id',
        component: () => import('pages/group/detail.vue'),
        props: true,
        meta: { title: '群组详情' }
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
