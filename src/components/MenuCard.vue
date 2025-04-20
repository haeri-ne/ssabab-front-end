<template>
  <v-card
    class="menu-card"
    elevation="2"
    rounded="lg"
    @click="goToReview"
  >
    <!-- 제목 -->
    <div class="card-title">오늘의 메뉴</div>
    
    <!-- 평균 평점 -->
    <div class="text-caption text-center mb-2">
      평균 별점 ⭐ {{ formattedMenuAvgScore }}
    </div>

    <v-divider class="my-1" />

    <!-- 메뉴 리스트 (6개 고정) -->
    <v-list class="pa-0" density="compact">
      <v-list-item
        v-for="(food, index) in props.menu.foods"
        :key="index"
        class="text-center px-0 py-0"
      >
        <v-list-item-title v-if="food.food_id" class="text-body-2 d-flex justify-space-between px-3">
          <span>{{ food.food_name }}</span>
          <span class="text-caption font-weight-medium">
            ⭐ {{ formattedFoodAvgScores[index] }}
          </span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { useMenuStore } from '../store/menuStore'
import { useUserStore } from '../store/userStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
import dayjs from 'dayjs'

const props = defineProps({
  menu: Object,
  menuIndex: Number,
  isVote: Boolean
})

const router = useRouter()

const dateStore = useDateStore()
const logStore = useLogStore()
const menuStore = useMenuStore()
const userStore = useUserStore()

const formattedMenuAvgScore = computed(() => {
  const score = props.menu.menu_avg_score
  return typeof score === 'number' ? score.toFixed(2) : '0.00'
})

const formattedFoodAvgScores = computed(() => {
  return props.menu.foods.map((food) => {
    const score = food.food_avg_score
    return typeof score === 'number' ? score.toFixed(1) : '0.0'
  })
})

const logClickMenu = () => {
  logStore.addLog({
    user_id: getOrCreateUUID(),
    event_name: 'click_menu',
    event_value: { menu_id: props.menu.menu_id },
    page_name: 'menus_view',
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

const goToReview = () => {
  if (props.isVote) return

  if (userStore.reviewedMenuId && userStore.reviewedMenuId !== props.menu.menu_id) {
    alert('이미 다른 메뉴에 별점을 남기셨습니다!')
    return
  }

  menuStore.setSelectedMenuIndex(props.menuIndex)

  logClickMenu()

  router.push({
    name: 'review',
    params: {
      date: dateStore.menusDate,
      menuId: props.menu.menu_id
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
  text-align: center;
  margin-bottom: 4px;
}
</style>
