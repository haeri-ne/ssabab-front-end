<template>
  <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
    <img
      src="../assets/ssabab-icon.png"
      class="fade-image"
      :class="{ 'fade-out': isFading }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { toKSTDateTime } from '../utils/timeUtil'
import { getOrCreateUUID } from '../utils/uuidUtil'

const router = useRouter()
const route = useRoute()

const dateStore = useDateStore()
const logStore = useLogStore()

const isFading = ref(false)

onMounted(() => {
  const uuid = getOrCreateUUID()

  logStore.addLog({
    user_id: uuid,
    event_name: 'view_home_screen',
    event_value: {},
    page_name: 'home_view',
    event_time: toKSTDateTime(new Date()),
  })

  // 1초 후 이미지 페이드 아웃 시작
  setTimeout(() => {
    isFading.value = true
  }, 1000)

  // 1.5초 후 날짜 저장 및 메뉴 페이지로 이동
  setTimeout(() => {
    dateStore.setDate(new Date())
    router.push(`/menus/${dateStore.date}`)
  }, 1500)
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath === '/' && oldPath !== '/') {
      // 뒤로 가기로 홈 화면에 다시 진입했을 때 실행
      const uuid = getOrCreateUUID()

      logStore.addLog({
        user_id: uuid,
        event_name: 'view_home_screen',
        event_value: {},
        page_name: 'home_view',
        event_time: toKSTDateTime(new Date()),
      })
    }
  }
)
</script>

<style scoped>
.fade-image {
  max-width: 80%;
  height: auto;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.fade-out {
  opacity: 0;
}
</style>