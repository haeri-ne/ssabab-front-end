<template>
  <div>
    <Header />

    <!-- 메뉴 카드 영역 -->
    <div class="main-content">
      <div class="card-container">
        <!-- 메뉴 카드 1 -->
        <MenuCard
          v-if="menuStore.menus.length > 0"
          :menu="menuStore.menus[0]"
          :menuIndex="1"
        />

        <!-- 메뉴 카드 2 -->
        <MenuCard
          v-if="menuStore.menus.length > 1"
          :menu="menuStore.menus[1]"
          :menuIndex="2"
        />
      </div>

      <!-- 안내 문구 -->
      <p class="instruction">별점을 남길 식단표를 눌러주세요</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '../store/menuStore'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { formatKSTDate, getKSTDateTimeStringWithMs } from '../utils/KSTDate'
import Header from '../components/Header.vue'
import MenuCard from '../components/MenuCard.vue'

const menuStore = useMenuStore()
const dateStore = useDateStore()
const logStore = useLogStore()
const route = useRoute()

const logMenusView = () => {
  const uuid = localStorage.getItem('uuid') || (() => {
    const newId = crypto.randomUUID()
    localStorage.setItem('uuid', newId)
    return newId
  })()

  logStore.addLog({
    user_id: uuid,
    event_name: 'view_menus_screen',
    event_value: {},
    page_name: 'menus_view',
    event_time: getKSTDateTimeStringWithMs(new Date()),
  })
}

onMounted(() => {
  menuStore.getMenusByDate()
  logMenusView()
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath.startsWith('/menus/') && oldPath !== newPath) {
      logMenusView()
    }
  }
)

watch(
  () => dateStore.date,
  async () => {
    await menuStore.getMenusByDate()
  }
)
</script>

<style scoped>
.main-content {
  height: calc(100vh - 64px);
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  gap: 12px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 800px;
}

.card-container > * {
  flex: 1 1 45%;
}


/* 기본은 column 방향 */
@media (max-width: 600px) {
  .card-container {
    flex-direction: column;
  }
}

/* 넓은 화면에서는 row 방향 */
@media (min-width: 601px) {
  .card-container {
    flex-direction: row;
  }
}

.instruction {
  font-size: 0.9rem;
  color: #666;
  margin-top: 8px;
  text-align: center;
}
</style>
