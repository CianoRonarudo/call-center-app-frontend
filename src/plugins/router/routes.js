export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    meta : { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
      {
        path: 'add-products',
        component: () => import('@/views/pages/users/add-products.vue'),
      },
      {
        path: 'edit-products',
        component: () => import('@/views/pages/users/edit-products.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    meta: {requiresAuth: false},
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
        meta: {forGuests: true},
      },
      {
        path: 'reset-password',
        component: () => import('@/pages/reset-password.vue'),
        meta: {forGuests: true},
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
        meta: {forGuests: true},
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
