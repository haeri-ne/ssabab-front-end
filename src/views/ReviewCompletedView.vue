<template>
  <div class="full-screen-center">
    <v-card class="pa-6 text-center" elevation="10" max-width="500" rounded="xl">
      <v-icon color="primary" size="48" class="mb-2">mdi-check-circle</v-icon>
      <h2 class="font-weight-bold mb-2">별점 제출 완료!</h2>
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
import { getOrCreateUUID } from '../utils/uuidUtil'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const dateStore = useDateStore()
const logStore = useLogStore()

const uuid = getOrCreateUUID()

const logReviewCompletedView = () => {
  logStore.addLog({
    user_id: uuid,
    event_name: 'view_review_completed_screen',
    event_value: {},
    page_name: 'review_completed_view',
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

const logClickHomeButton = () => {
  logStore.addLog({
    user_id: uuid,
    event_name: 'click_home_button',
    event_value: {},
    page_name: 'review_completed_view',
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

onMounted(() => {
  logReviewCompletedView()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (oldPath !== newPath) {
      logReviewCompletedView()
    }
  }
)

const goToHome = () => {
  logClickHomeButton()

  router.push({
    name: 'menus',
    params: {
      date: dateStore.menusDate
    }
  })
}
</script>

<style scoped>
.full-screen-center {
  height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
</style>
