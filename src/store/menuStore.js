import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDateStore } from '../store/dateStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
import axios from 'axios'

// 빈 메뉴 생성 함수
function createEmptyMenu() {
  return {
    menu_id: null,
    foods: [
      {
        food_id: null,
        food_name: null,
        food_avg_score: null
      },
      {
        food_id: null,
        food_name: null,
        food_avg_score: null
      },
      {
        food_id: null,
        food_name: null,
        food_avg_score: null
      },
      {
        food_id: null,
        food_name: null,
        food_avg_score: null
      },
      {
        food_id: null,
        food_name: null,
        food_avg_score: null
      },
      {
        food_id: null,
        food_name: null,
        food_avg_score: null
      }
    ],
    menu_date: null,
    menu_avg_score: null,
    menu_vote_count: null
  }
}

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([createEmptyMenu(), createEmptyMenu()])
  const selectedMenuIndex = ref(null)

  const setSelectedMenuIndex = (newSelectedMenuIndex) => {
    selectedMenuIndex.value = newSelectedMenuIndex
  }

  const dateStore = useDateStore()
  const uuid = getOrCreateUUID()
  
  const getVoteCountsByDate = async () => {
    if (dateStore.menusDate !== menus.value[0].menu_date) return

    try {
      const voteCountsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/votes/count`, {
        headers: {'user-id': uuid},
        params: {
          menu1_id: menus.value[0].menu_id,
          menu2_id: menus.value[1]. menu_id
        }
      })
  
      menus.value[0].menu_vote_count = voteCountsRes.data.menu1_count
      menus.value[1].menu_vote_count = voteCountsRes.data.menu2_count
    } catch {
      menus.value[0].menu_vote_count = 0
      menus.value[1].menu_vote_count = 0
    }
  }
  
  const getRatingsByDate = async () => {
    if (dateStore.menusDate !== menus.value[0].menu_date) return

    for (const menu of menus.value) {
      try {
        const ratingsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/statistics/mean/menus/${menu.menu_id}`, {
          headers: {'user-id': uuid},
          params: {
            date: menu.menu_date
          }
        })

        const statMap = new Map(ratingsRes.data.foods_statistics.map(fs => [fs.food_id, fs.mean]))

        let sum = 0
        let count = 0

        for (const food of menu.foods) {
          if (statMap.has(food.food_id)) {
            const mean = statMap.get(food.food_id)
            food.food_avg_score = mean
            sum += mean
            count++
          }
        }

        menu.menu_avg_score = count > 0 ? sum / count : 0
      } catch {
        for (const food of menu.foods) {
          food.food_avg_score = 0
        }
        menu.menu_avg_score = 0
      }
    }
  }

  const getMenusByDate = async () => {
    try {
      const menusRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/${dateStore.menusDate}`, {
        headers: {'user-id': uuid}
      })
  
      menusRes.data.forEach((newMenu, i) => {
        menus.value[i].menu_id = newMenu.id
        menus.value[i].menu_date = newMenu.date.slice(0, 10)
        newMenu.foods.forEach((food, j) => {
          menus.value[i].foods[j].food_id = food.id
          menus.value[i].foods[j].food_name = food.name
        })      
      })
    } catch {
      menus.value = [createEmptyMenu(), createEmptyMenu()]
    }
  }
  
  return {
    menus, selectedMenuIndex,
    setSelectedMenuIndex, getMenusByDate, getVoteCountsByDate, getRatingsByDate, 
  }
})
