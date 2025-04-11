<template>
  <router-view />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLogStore } from './store/logStore'

const logStore = useLogStore()
const logInterval = ref(null)

const sendLogsBeforeUnload = () => {
  navigator.sendBeacon(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/logs/front`,
    new Blob([JSON.stringify(logStore.logs)], {
      type: 'application/json'
    })
  )
}

onMounted(() => {
  // 10초마다 로그 전송
  logInterval.value = setInterval(() => {
    logStore.sendLogs()
  }, 10000)

  // 브라우저 종료/새로고침 시 마지막 로그 전송
  window.addEventListener('beforeunload', sendLogsBeforeUnload)
})

onBeforeUnmount(() => {
  // 컴포넌트 언마운트 시 인터벌 제거
  if (logInterval.value) clearInterval(logInterval.value)
  
  // 브라우저 종료 이벤트 리스너 제거
  window.removeEventListener('beforeunload', sendLogsBeforeUnload)
})
</script>

<style>
html, body, * {
  font-family: 'Pretendard Variable', sans-serif !important;
}
</style>
