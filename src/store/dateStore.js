import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toKSTDate } from '../utils/timeUtil'

export const useDateStore = defineStore('date', () => {
  // 보여줘야 하는 메뉴의 날짜
  const date = ref(toKSTDate(new Date()))


  // 날짜를 "YYYY-MM-DD" 형식으로 설정
  const setDate = (newDate) => {
    if (typeof newDate === 'string') {
      date.value = newDate
    } else if (newDate instanceof Date && !isNaN(newDate)) {
      date.value = toKSTDate(newDate)
    } else {
      console.warn('[dateStore] 잘못된 날짜 값:', newDate)
    }
  }

  return { 
    date, 
    setDate 
  }
})