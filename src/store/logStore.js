import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useLogStore = defineStore('log', () => {
  const logs = ref([])

  const addLog = (log) => {
    if (log.event_value === null) log.event_value = {} // null → {}
    logs.value.push(log)
  }

  const sendLogs = async () => {
    if (logs.value.length === 0) return

    const remainingLogs = []
    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/logs/front`

    for (const log of logs.value) {
      try {
        await axios.post(API_URL, log, {
          headers: {
            'Content-Type': 'application/json',
            'user-id': log.user_id
          }
        })
        // console.log('로그 전송 성공:', log)
      } catch (error) {
        console.error('로그 전송 실패:', error.response?.data || error)
        remainingLogs.push(log) // 실패한 건 남겨둠
      }
    }

    logs.value = remainingLogs // 실패한 로그만 다시 보낼 수 있도록 보관
  }

  return {
    logs,
    addLog, sendLogs
  }
})