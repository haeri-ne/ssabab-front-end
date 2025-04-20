import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getOrCreateUUID } from '../utils/uuidUtil'
import axios from 'axios'

export const useLogStore = defineStore('log', () => {
  const logs = ref([]) 

  // 로그 추가
  const addLog = (log) => {
    if (log.event_value === null) log.event_value = {} // null → {}
    logs.value.push(log)
  }

  // 로그 전송
  const sendLogs = async () => {
    if (logs.value.length === 0) return

    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/logs/front`
    const uuid = getOrCreateUUID()

    try {
      await axios.post(API_URL, logs.value, {
        headers: {
          'Content-Type': 'application/json',
          'user-id': uuid
        }
      })
    logs.value = []
    } catch (error) {
      console.error('로그 전송 실패:', error)
    }
  }

  return {
    logs,
    addLog, sendLogs
  }
})