import { defineStore } from 'pinia'
import { ref } from 'vue'
import { formatKSTDate } from '../utils/KSTDate'

export const useDateStore = defineStore('date', () => {
  const date = ref(formatKSTDate(new Date()))

  const setDate = (newDate) => {
    date.value = newDate
  }

  return { 
    date, 
    setDate 
  }
})