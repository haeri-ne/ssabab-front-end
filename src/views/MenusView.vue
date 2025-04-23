<template>
  <div class="menus-view">
    <!-- <Header /> -->

    <div class="main-content">
      <VotingPanel v-if="isBeforeNoon" />
      <RatingPanel v-else />
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { useMenuStore } from '../store/menuStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
// import Header from '../components/Header.vue'
import VotingPanel from '../components/VotingPanel.vue'
import RatingPanel from '../components/RatingPanel.vue'
import dayjs from 'dayjs'

const route = useRoute()

const dateStore = useDateStore()
const logStore = useLogStore()
const menuStore = useMenuStore()

const isBeforeNoon = computed(() => {
  const today = dayjs().format('YYYY-MM-DD')
  return (dateStore.menusDate === today && dayjs().hour() < 12) || (dateStore.menusDate > today)
})

const logMenusView = () => {
  logStore.addLog({
    user_id: getOrCreateUUID(),
    event_name: 'view_menus_screen',
    event_value: {},
    page_name: 'menus_view',
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

// 첫 진입 시 메뉴 불러오기
onMounted(async () => {
  await menuStore.getMenusByDate()
  if (isBeforeNoon.value) { await menuStore.getVoteCountsByDate() }
  else { await menuStore.getRatingsByDate() }
})

// 다른 주소에서 메뉴 페이지로 넘어오면 로그 추가하기
watch(
  () => route.fullPath,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      logMenusView()
      await menuStore.getMenusByDate()
      if (isBeforeNoon.value) { await menuStore.getVoteCountsByDate() }
      else { await menuStore.getRatingsByDate() }
    }
  }
)

// 라우터 주소에서 날짜가 바뀌었다면 새로 메뉴 데이터 불러오기
watch(
  () => route.params.date,
  async () => {
    dateStore.setMenusDate(route.params.date)
    await menuStore.getMenusByDate()
    if (isBeforeNoon.value) { await menuStore.getVoteCountsByDate() }
    else { await menuStore.getRatingsByDate() }
  },
  { immediate: true }
)
</script>

<style scoped>
.menus-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  min-height: 100vh;
}
</style>
