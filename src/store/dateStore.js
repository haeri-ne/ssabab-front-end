import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'

export const useDateStore = defineStore('date', () => {
  // 메뉴 날짜
  const menusDate = ref(dayjs().format('YYYY-MM-DD'))

  // 메뉴 날짜 설정하는 함수
  const setMenusDate = (newMenusDate) => {
    menusDate.value = newMenusDate
  }

  return { 
    menusDate, 
    setMenusDate,
  }
})