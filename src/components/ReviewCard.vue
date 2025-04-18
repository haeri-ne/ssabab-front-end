<template>
  <v-card class="review-card" elevation="2" rounded="xl" v-if="menu">
    <!-- 제목 -->
    <h3 class="text-center mb-1 text-h6 font-weight-bold text-primary">
      별점을 남겨주세요 :)
    </h3>
    
    <!-- 평균 평점 -->
    <p
      v-if="reviewData.avg_score !== undefined"
      class="text-center mb-2 text-grey-darken-1 text-caption"
    >
      현재 평균 평점: {{ reviewData.avg_score.toFixed(1) }}점
    </p>
    
    <!-- 음식 별점 입력 -->
    <v-row dense>
      <v-col
        v-for="(item, index) in reviewData.foods"
        :key="item.id"
        cols="12"
        class="py-1"
        >
        <div class="text-center mb-1">
          <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
          <span class="text-caption text-grey-darken-1 ms-1">{{ item.score }}</span>
        </div>
        
        <div class="d-flex justify-center">
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
        class="px-8 py-2 text-body-2 rounded-pill elevation-1"
        @click="submitReview"
      >
        제출
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
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

const menu = ref(null)

// 독립적인 평가 상태 객체
const reviewData = ref({
  menu_id: null,
  foods: [],
  comment: '',
  avg_score: 0
})

// menuStore로부터 읽기 전용 데이터 복사
watchEffect(() => {
  const source = menuStore.menus[props.menuIndex]
  if (source) {
    menu.value = source
    reviewData.value.menu_id = source.menu_id
    reviewData.value.foods = source.foods.map(food => ({
      id: food.id,
      name: food.name,
      score: 0
    }))
    reviewData.value.avg_score = 0
    reviewData.value.comment = ''
  }
})

const getStarIcon = (score, index) => {
  return score >= index ? 'mdi-star' : 'mdi-star-outline'
}

const setScore = (index, clickedScore) => {
  const current = reviewData.value.foods[index].score
  const newScore = current === clickedScore ? 0 : clickedScore
  reviewData.value.foods[index].score = newScore

  // 평균 계산
  const scores = reviewData.value.foods.map(f => f.score || 0)
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  reviewData.value.avg_score = Number(avg.toFixed(1))

  const uuid = getOrCreateUUID()
  logStore.addLog({
    user_id: uuid,
    event_name: 'set_food_score_by_star',
    event_value: {
      food_id: reviewData.value.foods[index].id,
      now_score: newScore
    },
    page_name: 'review_view',
    event_time: toKSTDateTime(new Date())
  })
}

const submitReview = async () => {
  const unReviewedItems = reviewData.value.foods.filter(item => item.score === 0)
  if (unReviewedItems.length > 0) {
    const confirmSubmit = confirm('평가가 완료되지 않았습니다. 그래도 제출하시겠습니까?')
    if (!confirmSubmit) return
  }

  const uuid = getOrCreateUUID()

  // 1. 평점 POST
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/foods/score`, reviewData.value.foods, {
      headers: { 'user-id': uuid }
    })
  } catch (error) {
    console.error('리뷰 POST 실패:', error)
  }

  // 2. 한줄평 POST
  if (reviewData.value.comment.trim()) {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/comments`, {
        menu_id: reviewData.value.menu_id,
        comment: reviewData.value.comment,
        created_at: toKSTDateTime(new Date())
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
      date: dateStore.date,
      menuId: reviewData.value.menu_id
    }
  })
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
