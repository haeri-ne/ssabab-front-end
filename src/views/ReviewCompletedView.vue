<template>
  <div class="wrapper d-flex justify-content-center align-items-center text-center">
    <div class="card p-5 shadow-lg">
      <!-- 완료 메시지 -->
      <h1 class="text-primary mb-3 fw-bold" style="font-family: 'GmarketSansMedium';">
        별점 제출 완료!
      </h1>
      <p class="fw-bold" style="font-family: 'GmarketSansLight';">
        소중한 평가를 해주셔서 감사합니다. 😊
      </p>

      <!-- 홈으로 이동 버튼 -->
      <button
        class="btn btn-primary mt-3 fw-bold"
        style="font-family: 'GmarketSansLight';"
        @click="goToHome"
      >
        홈으로 이동
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { formatKSTDate, getKSTDateTimeStringWithMs } from '../utils/KSTDate'

const router = useRouter()
const route = useRoute()
const dateStore = useDateStore()
const logStore = useLogStore()

const getUUID = () => {
  return localStorage.getItem('uuid') || (() => {
    const newId = crypto.randomUUID()
    localStorage.setItem('uuid', newId)
    return newId
  })()
}

const logPageView = () => {
  logStore.addLog({
    user_id: getUUID(),
    event_name: 'view_review_completed_screen',
    event_value: {},
    page_name: 'review_completed_view',
    event_time: getKSTDateTimeStringWithMs(new Date()),
  })
}

onMounted(() => {
  logPageView()
})

// 뒤로 가기 등으로 재진입 시 감지
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath.includes('review-completed') && oldPath !== newPath) {
      logPageView()
    }
  }
)

const goToHome = () => {
  const today = formatKSTDate(new Date())
  dateStore.setDate(today)

  logStore.addLog({
    user_id: getUUID(),
    event_name: 'click_home_button',
    event_value: {},
    page_name: 'review_completed_view',
    event_time: getKSTDateTimeStringWithMs(new Date()),
  })

  router.push({ name: 'menus', params: { date: dateStore.date } })
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card {
  max-width: 500px;
  width: 100%;
  border-radius: 12px;
  background-color: #f8f9fa;
}
</style>