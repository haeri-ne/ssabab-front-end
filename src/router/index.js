import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenusView from '../views/MenusView.vue'
import ReviewView from '../views/ReviewView.vue'
import ReviewCompletedView from '../views/ReviewCompletedView.vue'
import AdminView from '../views/AdminView.vue'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/menus/:date', name: 'menus', component: MenusView },
  { path: '/review/:date/:menuIndex', name: 'review', component: ReviewView },
  { path: '/review-completed', name: 'review-completed', component: ReviewCompletedView },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 라우터 이동 직전에 로그 전송
// router.beforeEach((to, from, next) => {
//   const logStore = useLogStore()
//   logStore.sendLogs()
//   next()
// })

export default router