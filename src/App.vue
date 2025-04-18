<template>
  <v-app>
    <!-- 사이드바 & 헤더: 일반 사용자 페이지에만 표시 -->
    <Sidebar v-if="!isAdminPage" v-model="sidebarOpen" class="sidebar" />
    <Header v-if="!isAdminPage" @toggle-sidebar="sidebarOpen = !sidebarOpen" class="header" />

    <!-- 본문 영역 -->
    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useLogStore } from './store/logStore'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const route = useRoute()
const sidebarOpen = ref(false)
const logStore = useLogStore()
const logInterval = ref(null)

// 어드민 페이지 여부
const isAdminPage = computed(() => route.path.startsWith('/admin'))

// 로그 백업 전송
const sendLogsBeforeUnload = () => {
  navigator.sendBeacon(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/logs/front`,
    new Blob([JSON.stringify(logStore.logs)], {
      type: 'application/json'
    })
  )
}

onMounted(() => {
  logInterval.value = setInterval(() => {
    logStore.sendLogs()
  }, 10000)

  window.addEventListener('beforeunload', sendLogsBeforeUnload)
})

onBeforeUnmount(() => {
  if (logInterval.value) clearInterval(logInterval.value)
  window.removeEventListener('beforeunload', sendLogsBeforeUnload)
})
</script>

<style scoped>
html, body, #app, .v-application {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}


.v-application {
  font-family: 'Pretendard Variable', sans-serif;
}

/* ✅ 헤더 아래 여백 확보 */
.main-content {
  padding-top: 80px;
  padding-bottom: 40px;
}

/* 모바일 대응시 적절한 여백 유지 */
@media (max-width: 600px) {
  .main-content {
    padding-top: 64px;
    padding-bottom: 24px;
  }
}
</style>
