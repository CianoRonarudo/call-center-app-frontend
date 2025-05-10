import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  
  // Routes protegées
  if(to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.forGuests && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default function (app) {
  app.use(router)
}
export { router }
