<template>
  <v-card class="review-card compact" elevation="2" rounded="xl" v-if="menu">
    <h3 class="text-center mb-3 text-primary text-subtitle-1 font-weight-bold">
      별점을 남겨주세요 :)
    </h3>

    <v-row dense>
      <v-col
        v-for="(item, index) in menu.foods"
        :key="item.id"
        cols="12"
        class="py-1"
      >
        <div class="text-center">
          <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
          <span class="text-caption text-grey-darken-1 ms-1">{{ item.score }}</span>
        </div>

        <div class="d-flex justify-center mt-1">
          <v-icon
            v-for="n in 5"
            :key="n"
            :icon="getStarIcon(item.score, n)"
            class="star-icon mx-1"
            @click="setScore(index, n)"
          />
        </div>
      </v-col>
    </v-row>

    <v-textarea
      v-model="comment"
      variant="outlined"
      auto-grow
      rows="2"
      counter
      maxlength="200"
      class="mt-6"
      color="primary"
      placeholder="소감을 남겨주세요 :)"
    />

    <div class="text-center mt-2">
      <v-btn color="primary" class="px-6 py-1 text-body-2" @click="submitReview">
        제출
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { useMenuStore } from '../store/menuStore'
import { toKSTDateTime } from '../utils/timeUtil'
import { getOrCreateUUID } from '../utils/uuidUtil'
import axios from 'axios'

const props = defineProps({
  menuIndex: Number
})

const router = useRouter()

const dateStore = useDateStore()
const logStore = useLogStore()
const menuStore = useMenuStore()

const menu = computed(() => menuStore.menus[props.menuIndex])

const setScore = (index, clickedScore) => {
  if (!menu.value || !menu.value.foods) return

  const current = menu.value.foods[index].score
  const newScore = current === clickedScore ? 0 : clickedScore

  menu.value.foods[index].score = newScore

  const uuid = getOrCreateUUID()

  logStore.addLog({
    user_id: uuid,
    event_name: 'set_food_score_by_star',
    event_value: {
      food_id: menu.value.foods[index].id,
      now_score: newScore
    },
    page_name: 'review_view',
    event_time: toKSTDateTime(new Date())
  })
}

const getStarIcon = (score, index) => {
  return score >= index ? 'mdi-star' : 'mdi-star-outline'
}

const comment = ref('')

const submitComment = async () => {
  if (!comment.value.trim()) return

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/comments`
  const uuid = getOrCreateUUID()

  try {
    await axios.post(API_URL, {
      menu_id: menu.value.menu_id,
      comment: comment.value,
      created_at: toKSTDateTime(new Date())
    }, {
      headers: {
        'user-id': uuid
      }
    })
  } catch (error) {
    console.error('한줄평 POST 실패:', error)
  }
}

const avgScore = computed(() => {
  const foods = menu.value?.foods || []
  if (foods.length === 0) return 0

  const total = foods.reduce((sum, food) => sum + food.score, 0)
  return Number((total / foods.length).toFixed(1))
})

const submitReview = async () => {
  if (!menu.value || !menu.value.foods) return
  
  const unReviewedItems = menu.value.foods.filter((item) => item.score === 0)
  if (unReviewedItems.length > 0) {
    const confirmSubmit = confirm('평가가 완료되지 않았습니다. 그래도 제출하시겠습니까?')
    if (!confirmSubmit) return
  }

  menuStore.menus[props.menuIndex] = {
    ...menuStore.menus[props.menuIndex],
    avg_score: avgScore.value
  }
  
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/foods/score`
  const uuid = getOrCreateUUID()
  const reviewList = menu.value.foods.map(food => ({
    food_id: food.id,
    score: food.score
  }))
  
  try {
    await axios.post(API_URL, reviewList, {
      headers: { 'user-id': uuid }
    })
  } catch (error) {
    console.error('리뷰 POST 실패:', error)
  }

  await submitComment()

  router.push({
    name: 'review-completed',
    params: {
      date: dateStore.date,
      menuId: menu.value.menu_id
    }
  })
}
</script>

<style scoped>
.review-card {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: white;
}

.star-icon {
  font-size: 22px;
  color: #fbc02d;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.star-icon:hover {
  transform: scale(1.1);
}
</style>
