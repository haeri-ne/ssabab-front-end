import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenusView from '../views/MenusView.vue'
import ReviewView from '../views/ReviewView.vue'
import ReviewCompletedView from '../views/ReviewCompletedView.vue'
import AdminView from '../views/AdminView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SsafeeView from '../views/SsafeeView.vue'
import AuthView from '../views/AuthView.vue'
import dayjs from 'dayjs'

const getTodayDateString = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const routes = [
  // ✅ 첫 진입은 메뉴 페이지로
  { 
    path: '/', 
    redirect: () => {
      const today = dayjs().format('YYYY-MM-DD')
      return `/menus/${today}`
    } 
  },
  { path: '/home', name: 'home-page', component: HomeView },

  // ✅ 기존 MenusView는 SSABAB 메뉴로 이동
  { path: `/menus/:date`, name: 'menus', component: MenusView },

  { path: '/review/:date/:menuId', name: 'review', component: ReviewView },
  { path: '/review/:date/:menuId/completed', name: 'review-completed', component: ReviewCompletedView },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/analytics/:date', name: 'analytics', component: AnalyticsView },
  { path: '/ssafe', name: 'ssafe', component: SsafeeView },
  { path: '/auth', name: 'auth', component: AuthView },

  { path: '/:pathMatch(.*)*', redirect: '/home' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
