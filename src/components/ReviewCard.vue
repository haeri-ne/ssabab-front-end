<template>
  <v-card class="review-card" elevation="2" rounded="xl">
    <!-- 제목 -->
    <h3 class="text-center mb-1 text-h6 font-weight-bold">
      별점을 남겨주세요 :)
    </h3>
    
    <!-- 평균 평점 -->
    <p class="text-center mb-2 text-grey-darken-1 text-caption">
      현재 평균 평점: {{ reviewData.menu_avg_score.toFixed(1) }}점
    </p>
    
    <!-- 음식 별점 입력 -->
    <v-row dense>
      <v-col
        v-for="(food, index) in reviewData.foods"
        :key="food.food_id"
        cols="12"
        class="py-1"
        >
        <div class="text-center mb-1">
          <span class="text-body-2 font-weight-medium">{{ food.food_name }}</span>
          <span class="text-caption text-grey-darken-1 ms-1">{{ food.food_score }}</span>
        </div>
        
        <div class="d-flex justify-center">
          <v-rating
            v-model="food.food_score"
            half-increments
            hover
            color="yellow-darken-2"
            background-color="grey-lighten-1"
            size="28"
            @update:model-value="onRatingUpdate(index)"
          />
        </div>
      </v-col>
    </v-row>
    
    <!-- 한줄평 -->
    <v-textarea
    v-model="reviewData.comment"
    variant="outlined"
    auto-grow
    rows="2"
    counter
    maxlength="200"
    class="mt-6 rounded-lg"
    color="primary"
    placeholder="소감을 남겨주세요 :)"
    />

    <!-- 제출 버튼 -->
    <div class="text-center mt-4">
      <v-btn
        color="primary"
        class="px-8 py-2 text-body-2 elevation-1"
        @click="submitReview"
      >
        제출
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { useMenuStore } from '../store/menuStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
import axios from 'axios'
import dayjs from 'dayjs'

const props = defineProps({
  menu: Object,
  menuIndex: Number
})

const router = useRouter()

const dateStore = useDateStore()
const logStore = useLogStore()
const menuStore = useMenuStore()

const uuid = getOrCreateUUID()

const reviewData = ref({
  menu_id: props.menu.menu_id,
  foods: [],
  comment: "",
  menu_avg_score: 0
})

reviewData.value.foods = props.menu.foods
  .filter(food => food.food_id !== null)
  .map(food => ({
    food_id: food.food_id,
    food_name: food.food_name,
    food_score: 0
  }))

const onRatingUpdate = (index) => {
  const scores = reviewData.value.foods.map(f => f.food_score || 0)
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  reviewData.value.menu_avg_score = Number(avg.toFixed(1))

  // 클릭한 별점의 정보를 로그에 저장
  const food = reviewData.value.foods[index]
  logStore.addLog({
    user_id: uuid,
    event_name: 'set_food_score_by_star',
    event_value: {
      food_id: food.food_id,
      now_score: food.food_score
    },
    page_name: 'review_view',
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })  
}

const submitReview = async () => {
  const unReviewedItems = reviewData.value.foods.filter(item => item.food_score === 0)
  if (unReviewedItems.length > 0) {
    const confirmSubmit = confirm('평가가 완료되지 않았습니다. 그래도 제출하시겠습니까?')
    if (!confirmSubmit) return
  }

  // 1. 평점 POST
  try {
    const request = reviewData.value.foods.map(food => ({
      score: food.food_score,
      food_id: food.food_id
    }))
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/scores/`, request, {
      headers: { 'user-id': uuid }
    })
  } catch (error) {
    console.error('리뷰 POST 실패:', error)
  }

  // 2. 한줄평 POST
  if (reviewData.value.comment.trim()) {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/comments/`, {
        menu_id: reviewData.value.menu_id,
        comment: reviewData.value.comment,
        created_at: dayjs().toISOString()
      }, {
        headers: { 'user-id': uuid }
      })
    } catch (error) {
      console.error('한줄평 POST 실패:', error)
    }
  }
  
  // 3. 완료 화면 이동
  router.push({
    name: 'review-completed',
    params: {
      date: dateStore.menusDate,
      menuId: reviewData.value.menu_id
    }
  })

  // 4. 메뉴 정보 최신화
  await menuStore.getRatingsByDate()
}
</script>

<style scoped>
.review-card {
  max-width: 440px;
  margin: auto;
  padding: 28px 24px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.star-icon {
  font-size: 24px;
  color: #fbc02d;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.star-icon:hover {
  transform: scale(1.2);
}
</style>
