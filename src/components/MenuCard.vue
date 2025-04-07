<template>
  <v-card
    class="menu-card"
    elevation="2"
    rounded="lg"
    @click="goToReview"
  >
    <!-- 제목 -->
    <div class="card-title">오늘의 메뉴</div>
    <v-divider class="my-1" />

    <!-- 메뉴 리스트 (6개 고정) -->
    <v-list class="pa-0" density="compact">
      <v-list-item
        v-for="(food, index) in paddedFoods"
        :key="index"
        class="text-center px-0 py-0"
      >
        <v-list-item-title class="text-body-2">
          {{ food.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '../store/menuStore'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { getKSTDateTimeStringWithMs } from '../utils/KSTDate'

const props = defineProps({
  menu: Object,
  menuIndex: Number
})

const router = useRouter()
const menuStore = useMenuStore()
const dateStore = useDateStore()
const logStore = useLogStore()

const paddedFoods = computed(() => {
  const foods = props.menu?.foods || []
  return [...foods, ...Array(6 - foods.length).fill({ name: '' })].slice(0, 6)
})

const goToReview = () => {
  menuStore.selectedMenu = props.menu

  const uuid = localStorage.getItem('uuid') || (() => {
    const newId = crypto.randomUUID()
    localStorage.setItem('uuid', newId)
    return newId
  })()

  logStore.addLog({
    user_id: uuid,
    event_name: 'click_menu',
    event_value: { menu_id: props.menu.id },
    page_name: 'menus_view',
    event_time: getKSTDateTimeStringWithMs(new Date())
  })

  router.push({
    name: 'review',
    params: {
      date: dateStore.date,
      menuIndex: props.menuIndex
    }
  })
}
</script>

<style scoped>
.menu-card {
  width: 100%;
  padding: 12px 10px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.menu-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1976d2;
  text-align: center;
  margin-bottom: 4px;
}
</style>
