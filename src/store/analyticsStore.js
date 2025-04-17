import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAnalyticsStore = defineStore('analytics', () => {
  const menus = ref([])
  const statistics = ref({})  // { menuId: statObject }
  const counters = ref({})    // { menuId: { vote_count, comment_count } }

  const fetchAnalyticsByDate = async (date) => {
    try {
      const { data: menuList } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/${date}`)
      menus.value = menuList
  
      for (const menu of menuList) {
        // 통계는 생략하고 counters만 호출
        try {
          const counterRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/${menu.id}/counters`)
  
          // 반드시 새 객체로 갱신 (Vue 반응형 보장!)
          counters.value = {
            ...counters.value,
            [menu.id]: counterRes.data
          }
        } catch (counterErr) {
          console.warn(`❌ counters 로딩 실패 (menu_id=${menu.id})`, counterErr)
        }
      }
    } catch (e) {
      console.error('📉 분석 데이터 로딩 실패:', e)
    }
  }
  

  return {
    menus,
    statistics,
    counters,
    fetchAnalyticsByDate
  }
})
