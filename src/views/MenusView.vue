<template>
  <div class="menus-view">
    <!-- <Header /> -->

    <div class="main-content">
      <div class="card-grid">
        <!-- 메뉴 카드 1 -->
        <MenuCard
          v-if="menuStore.menus.length > 0"
          :menu="menuStore.menus[0]"
          :menuIndex="0"
        />

        <!-- 메뉴 카드 2 -->
        <MenuCard
          v-if="menuStore.menus.length > 1"
          :menu="menuStore.menus[1]"
          :menuIndex="1"
        />
      </div>

      <p class="instruction">별점을 남길 식단표를 눌러주세요</p>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { useMenuStore } from '../store/menuStore'
import { toKSTDateTime } from '../utils/timeUtil'
import { getOrCreateUUID } from '../utils/uuidUtil'
import Header from '../components/Header.vue'
import MenuCard from '../components/MenuCard.vue'

const route = useRoute()

const dateStore = useDateStore()
const logStore = useLogStore()
const menuStore = useMenuStore()

// URL → 로그 기록
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath.startsWith('/menus/') && oldPath !== newPath) {
      const uuid = getOrCreateUUID()
      logStore.addLog({
        user_id: uuid,
        event_name: 'view_menus_screen',
        event_value: {},
        page_name: 'menus_view',
        event_time: toKSTDateTime(new Date()),
      })
    }
  }
)

// route.params.date → dateStore.date
watch(
  () => route.params.date,
  (newDate) => {
    if (newDate && newDate !== dateStore.date) {
      dateStore.setDate(newDate)
    }
  },
  { immediate: true }
)

// dateStore.date → 메뉴 다시 로딩
watch(
  () => dateStore.date,
  async () => {
    await menuStore.getMenusByDate()
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
  justify-content: flex-start; /* ← 위쪽 정렬로 수정 */
  gap: 16px;
  min-height: 100vh;
}

/* ✅ 카드 전체를 감싸는 영역에 최대 너비 제한 */
.card-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 800px;     /* 최대 너비 제한 */
  padding: 0 16px;       /* 양옆 여백 */
  margin: 0 auto;        /* 가운데 정렬 */
}

@media (min-width: 768px) {
  .card-grid {
    flex-direction: row;
    justify-content: center;
    gap: 24px;
  }
}

.instruction {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-top: 8px;
}
</style>
