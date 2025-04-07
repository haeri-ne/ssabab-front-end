<template>
  <v-app>
    <!-- 헤더 -->
    <Header />

    <!-- 리뷰 카드 영역 -->
    <v-main class="bg-grey-lighten-5">
      <v-container
        class="fill-height d-flex justify-center align-start pt-0"
        fluid
      >
        <!-- ReviewCard 자체가 카드 스타일 담당 -->
        <ReviewCard :menu="menuStore.selectedMenu" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '../store/menuStore'
import { useLogStore } from '../store/logStore'
import { getKSTDateTimeStringWithMs } from '../utils/KSTDate'
import Header from '../components/Header.vue'
import ReviewCard from '../components/ReviewCard.vue'

const menuStore = useMenuStore()
const logStore = useLogStore()
const route = useRoute()

const logReviewView = () => {
  const uuid = localStorage.getItem('uuid') || (() => {
    const newId = crypto.randomUUID()
    localStorage.setItem('uuid', newId)
    return newId
  })()

  logStore.addLog({
    user_id: uuid,
    event_name: 'view_review_screen',
    event_value: {},
    page_name: 'review_view',
    event_time: getKSTDateTimeStringWithMs(new Date()),
  })
}

onMounted(() => {
  logReviewView()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath.startsWith('/review') && oldPath !== newPath) {
      logReviewView()
    }
  }
)
</script>
