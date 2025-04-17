<template>
  <v-container class="py-10 px-4 home-container">
    <!-- 🔰 로고 배너 (5초 후 자동 사라짐) -->
    <v-row justify="center" class="mb-8" v-if="showBanner">
      <div class="text-center">
        <v-card class="pa-4" flat tile>
          <v-img
            src="/ssabab-icon.png"
            alt="SSABAB 로고"
            width="300"
            class="banner-img"
            contain
          />
        </v-card>
        <p class="banner-caption">5초 후에 배너가 닫힙니다</p>
      </div>
    </v-row>

    <!-- 📌 SSABAB 한 줄 소개 -->
    <v-card class="pa-6 mb-6 text-center" elevation="2" rounded="xl">
      <h1 class="text-h6 font-weight-bold mb-2">SSABAB</h1>
      <p>
        SSAFY 대전 캠퍼스의 점심 메뉴를 더 맛있게 선택할 수 있도록,<br>
        사용자 평가 기반으로 메뉴를 추천하는 스마트 식단 분석 서비스입니다.<br>
        실패 없는 점심, 싸밥이 도와드릴게요! 🍱✨
      </p>
    </v-card>

    <!-- 📢 공지사항 -->
    <v-card class="pa-6 mb-6" elevation="2" rounded="xl">
      <h2 class="text-subtitle-1 font-weight-bold mb-2">📢 공지사항</h2>
      <p class="mb-1">🔔 <strong>2025.04.20</strong> - SSABAB 버전 1 배포 예정 🎉</p>
      <p class="mb-1">📨 기능 오류나 개선 요청은 mm을 통해 전달해주세요!!</p>
    </v-card>

    <!-- 🛠️ 앞으로의 업데이트 -->
    <v-card class="pa-6 mb-6" elevation="2" rounded="xl">
      <h2 class="text-subtitle-1 font-weight-bold mb-2">🛠️ 앞으로 추가될 기능</h2>
      <ul class="ml-4">
        <li>✨ 사용자 맞춤형 메뉴 추천 기능</li>
        <li>📊 실시간 인기 메뉴/음료 분석</li>
        <li>🧠 메뉴와 음료 통합 추천을 위한 군집 기반 분석</li>
        <li>💬 사용자 한 줄 리뷰 분석 및 감성 요약</li>
      </ul>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(true)

onMounted(() => {
  setTimeout(() => {
    showBanner.value = false
  }, 5000)
})
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
}

ul {
  padding-left: 1rem;
  list-style-type: disc;
}

.banner-img {
  border-radius: 12px;
}

.banner-caption {
  font-size: 0.85rem;
  color: #888;
  margin-top: 8px;
}
</style>
