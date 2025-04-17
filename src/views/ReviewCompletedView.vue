<template>
  <div class="full-screen-center">
    <v-card class="pa-6 text-center" elevation="10" max-width="500" rounded="xl">
      <v-icon color="primary" size="48" class="mb-2">mdi-check-circle</v-icon>
      <h2 class="text-primary font-weight-bold mb-2">별점 제출 완료!</h2>
      <p class="mb-6 font-weight-medium">소중한 평가를 해주셔서 감사합니다 😊</p>

      <v-btn color="primary" size="large" class="px-6 fw-bold" @click="goToHome">
        홈으로 이동
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { toKSTDateTime } from '../utils/timeUtil'
import { getOrCreateUUID } from '../utils/uuidUtil'

const router = useRouter()
const route = useRoute()

const dateStore = useDateStore()
const logStore = useLogStore()

const uuid = getOrCreateUUID()

const logPageView = () => {
  logStore.addLog({
    user_id: uuid,
    event_name: 'view_review_completed_screen',
    event_value: {},
    page_name: 'review_completed_view',
    event_time: toKSTDateTime(new Date()),
  })
}

onMounted(() => {
  logPageView()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath.includes('completed') && oldPath !== newPath) {
      logPageView()
    }
  }
)

const goToHome = () => {
  logStore.addLog({
    user_id: uuid,
    event_name: 'click_home_button',
    event_value: {},
    page_name: 'review_completed_view',
    event_time: toKSTDateTime(new Date()),
  })

  router.push({ name: 'home-page' })
}
</script>

<style scoped>
.full-screen-center {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
</style>
