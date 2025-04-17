<template>
  <div class="pa-4 d-flex justify-center">
    <div class="analytics-wrapper">
      <h1 class="text-h5 font-weight-bold mb-6">📦 메뉴 투표 현황</h1>

      <v-alert
        type="info"
        variant="tonal"
        class="mb-6"
        border="start"
        color="blue"
      >
        📊 <strong>금일 총 투표 수:</strong> {{ totalVotes }}표
      </v-alert>

      <v-row dense v-for="menu in analyticsStore.menus" :key="menu.id" class="mb-6">
        <v-col cols="12">
          <v-card class="pa-4" elevation="4" rounded="xl">
            <!-- 상단 정보 -->
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <h2 class="text-subtitle-1 font-weight-bold">🗓 {{ menu.date.split('T')[0] }}</h2>
                <p class="text-caption">메뉴 ID: {{ menu.id }}</p>
              </div>
              <v-chip color="primary" variant="flat">🍽️ 총 음식: {{ menu.foods.length }}</v-chip>
            </div>

            <v-divider class="my-2" />

            <!-- 음식 리스트 -->
            <div class="d-flex flex-wrap mb-4">
              <v-chip
                v-for="food in menu.foods"
                :key="food.id"
                class="ma-1"
                color="green"
                variant="outlined"
                size="small"
              >
                🍱 {{ food.name }}
              </v-chip>
            </div>

            <!-- 투표/댓글 -->
            <div v-if="analyticsStore.counters[menu.id]">
              <p class="text-subtitle-2 mb-1">🧮 투표 수: {{ analyticsStore.counters[menu.id].vote_count }}</p>

              <v-progress-linear
                :model-value="analyticsStore.counters[menu.id].vote_count"
                :max="MAX_VOTE_COUNT"
                color="red"
                height="20"
                rounded
                class="mb-2"
              >
                <strong>{{ analyticsStore.counters[menu.id].vote_count }}표</strong>
              </v-progress-linear>

              <p class="text-subtitle-2">💬 댓글 수: {{ analyticsStore.counters[menu.id].comment_count }}</p>
            </div>

            <div v-else>
              <p class="text-caption text-grey">❌ 카운터 데이터 없음</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAnalyticsStore } from '../store/analyticsStore'

const route = useRoute()
const analyticsStore = useAnalyticsStore()

// 최대 투표 수는 임시로 100 기준
const MAX_VOTE_COUNT = 100

onMounted(() => {
  analyticsStore.fetchAnalyticsByDate(route.params.date)
})

const totalVotes = computed(() => {
  return analyticsStore.menus.reduce((sum, menu) => {
    const counter = analyticsStore.counters[menu.id]
    return sum + (counter?.vote_count || 0)
  }, 0)
})

</script>

<style scoped>
/* 앱에서 너무 작거나 크게 나오지 않도록 간결하게 */
h2 {
  font-size: 1.1rem;
}

.analytics-wrapper {
  max-width: 800px;
  width: 100%;
}
</style>
