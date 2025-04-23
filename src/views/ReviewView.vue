<template>
  <v-app>
    <!-- 헤더 -->
    <!-- <Header /> -->

    <!-- 리뷰 카드 영역 -->
    <v-main>
      <v-container>
        <ReviewCard 
        :menu="menuStore.menus[menuStore.selectedMenuIndex]"
        :menuIndex="menuStore.selectedMenuIndex" 
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLogStore } from '../store/logStore'
import { useMenuStore } from '../store/menuStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
// import Header from '../components/Header.vue'
import ReviewCard from '../components/ReviewCard.vue'
import dayjs from 'dayjs'

const route = useRoute()

const logStore = useLogStore()
const menuStore = useMenuStore()

const logReviewView = () => {
  logStore.addLog({
    user_id: getOrCreateUUID(),
    event_name: 'view_review_screen',
    event_value: {},
    page_name: 'review_view',
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

onMounted(() => {
  logReviewView()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (oldPath !== newPath) {
      logReviewView()
    }
  }
)
</script>
