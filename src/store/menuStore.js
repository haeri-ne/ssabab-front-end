import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useDateStore } from '../store/dateStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
import axios from 'axios'

// 빈 메뉴 생성 함수
function createEmptyMenu() {
  return {
    menu_id: null,
    foods: [],
    avg_score: 0
  }
}

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([createEmptyMenu(), createEmptyMenu()])
  const selectedMenuIndex = ref(null)

  const dateStore = useDateStore()
  const date = computed(() => dateStore.date)

  // 마지막으로 메뉴를 가져온 날짜 저장
  const lastFetchedDate = ref(null)

  // 메뉴 조회 함수
  const getMenusByDate = async () => {
    const uuid = getOrCreateUUID()
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/${date.value}`

    try {
      const res = await axios.get(url, {
        headers: { 'user-id': uuid }
      })

      // 마지막으로 메뉴를 가져온 날짜와 현재 지정된 날짜가 다르면
      // 각 음식의 score를 0으로 설정, avg_rating을 0으로 설정
      // 반대의 경우, 각 음식의 score를 원래 값으로 설정, avg_rating을 원래 값으로 설정
      const isNewDate = lastFetchedDate.value !== date.value
      lastFetchedDate.value = date.value

      menus.value = res.data.map((menu, i) => {
        const oldFoods = menus.value[i]?.foods || []

        const foods = menu.foods.map(food => {
          const old = oldFoods.find(f => f.id === food.id)
          return {
            ...food,
            score: isNewDate ? 0 : (old?.score ?? 0)
          }
        })

        return {
          menu_id: menu.id,
          foods,
          avg_score: isNewDate ? 0 : (menus.value[i]?.avg_score ?? 0)
        }
      })
    } catch (err) {
      console.error('메뉴 불러오기 실패:', err?.response?.data || err)
    }
  }

  // 날짜 변경 시 자동 로딩
  watch(date, () => {
    getMenusByDate()
  }, { immediate: true })

  return {
    menus, selectedMenuIndex,
    getMenusByDate
  }
})
