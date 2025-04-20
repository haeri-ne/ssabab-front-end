import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDateStore } from './dateStore'
import { useMenuStore } from './menuStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const votedMenuId = ref(null)
  const reviewedMenuId = ref(null)

  const setVotedMenuId = (menuId) => {
    votedMenuId.value = menuId
  }

  const setReviewedMenuId = (menuId) => {
    reviewedMenuId.value = menuId
  }

  const getVotedMenuId = async () => {
    const uuid = getOrCreateUUID()
    const menuStore = useMenuStore()

    for (const menu of menuStore.menus) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/votes/${menu.menu_id}`, {
          headers: { 'user-id': uuid },
          params: {
            menu_id: menu.menu_id
          }
        })

        if (res.data) {
          votedMenuId.value = menu.menu_id
          break
        }
      }
      catch {
        continue
      }
    }
  }

  const getReviewedMenuId = async () => {
    const uuid = getOrCreateUUID()
    const menuStore = useMenuStore()
    
    for (const menu of menuStore.menus) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/scores/${menu.menu_id}`, {
          headers: { 'user-id': uuid },
          params: {
            menu_id: menu.menu_id
          }
        })

        if (res.data) {
          reviewedMenuId.value = menu.menu_id
          break
        }
      }
      catch {
        continue
      }
    }    
  }

  const dateStore = useDateStore()
  watch(
    () => dateStore.menusDate,
    async () => {
      await getVotedMenuId()
      await getReviewedMenuId()
    },
    { immediate: true }
  )

  return {
    votedMenuId, reviewedMenuId,
    setVotedMenuId, setReviewedMenuId, getVotedMenuId, getReviewedMenuId
  }
})
