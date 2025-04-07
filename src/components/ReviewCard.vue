<template>
  <v-container
    class="pt-0 pb-4"
    style="max-width: 500px;"
  >
    <v-card class="pa-4" elevation="2" rounded="lg">
      <h4 class="text-center mb-4 text-subtitle-1">별점을 매겨주세요</h4>

      <v-row dense>
        <v-col
          v-for="(item, index) in reviewData"
          :key="item.food_id"
          cols="12"
          class="pb-1"
        >
          <div class="text-body-2 font-weight-medium mb-1 text-center">
            {{ item.food_name }}
          </div>

          <div class="d-flex justify-center align-center">
            <v-icon
              v-for="n in 5"
              :key="n"
              :icon="getStarIcon(item.score, n)"
              class="star-icon mx-1"
              @click="setScore(index, n)"
            />
            <span class="text-caption font-weight-bold ms-2" style="width: 28px;">
              {{ item.score.toFixed(1) }}
            </span>
          </div>
        </v-col>
      </v-row>

      <div class="text-center mt-4">
        <v-btn
          color="primary"
          class="px-5"
          :loading="loading"
          :disabled="loading"
          @click="submitReview"
        >
          제출
        </v-btn>
      </div>
    </v-card>

    <!-- ✅ 로딩 오버레이 -->
    <v-overlay
      :model-value="loading"
      class="custom-overlay d-flex align-center justify-center"
      persistent
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          size="50"
          width="6"
          color="primary"
        />
        <div class="mt-3 text-subtitle-1 font-weight-medium text-white">로딩 중입니다...</div>
      </div>
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useLogStore } from '../store/logStore'
import { getKSTDateTimeStringWithMs } from '../utils/KSTDate'

const props = defineProps({
  menu: Object
})

const router = useRouter()
const logStore = useLogStore()
const loading = ref(false)

const reviewData = ref(
  props.menu.foods.map((food) => ({
    food_id: food.id,
    food_name: food.name,
    score: 0.0
  }))
)

const setScore = (index, clickedScore) => {
  const current = reviewData.value[index].score
  const newScore = current === clickedScore ? 0 : clickedScore
  reviewData.value[index].score = newScore

  const uuid = localStorage.getItem('uuid') || (() => {
    const newId = crypto.randomUUID()
    localStorage.setItem('uuid', newId)
    return newId
  })()

  logStore.addLog({
    user_id: uuid,
    event_name: 'set_food_score_by_star',
    event_value: {
      food_id: reviewData.value[index].food_id,
      new_score: newScore
    },
    page_name: 'review_view',
    event_time: getKSTDateTimeStringWithMs(new Date())
  })
}

const getStarIcon = (score, index) => {
  return score >= index ? 'mdi-star' : 'mdi-star-outline'
}

const submitReview = async () => {
  loading.value = true

  const uuid = localStorage.getItem('uuid') || (() => {
    const newId = crypto.randomUUID()
    localStorage.setItem('uuid', newId)
    return newId
  })()

  const unReviewedItems = reviewData.value.filter((item) => item.score === 0)
  if (unReviewedItems.length > 0) {
    const confirmSubmit = confirm('평가가 완료되지 않았습니다. 그래도 제출하시겠습니까?')
    if (!confirmSubmit) {
      loading.value = false
      return
    }
  }

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/foods/score`

  try {
    for (const item of reviewData.value) {
      await axios.post(API_URL, {
        food_id: item.food_id,
        score: item.score
      }, {
        headers: { 'user-id': uuid }
      })
    }

    // await new Promise(resolve => setTimeout(resolve, 3000))

    router.push({ name: 'review-completed' })
  } catch (error) {
    console.error('리뷰 POST 실패:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.star-icon {
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.2s ease;
  color: #fbc02d;
}
.star-icon:hover {
  transform: scale(1.15);
}

/* ✅ 커스텀 오버레이 배경 */
.custom-overlay {
  background-color: rgba(50, 50, 50, 0.6); /* 약간 어두운 회색 투명 배경 */
  z-index: 9999;
}
</style>
