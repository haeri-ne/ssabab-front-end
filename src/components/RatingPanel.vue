<template>
  <div class="rating-panel">
    <p class="instruction">오늘 드신 메뉴를 눌러 별점을 남겨주세요!</p>

    <div class="card-grid">
      <MenuCard
        v-for="(menu, index) in validMenus"
        :key="index"
        :menu="menu"
        :menuIndex="index"
        :isVote="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMenuStore } from '../store/menuStore'
import MenuCard from './MenuCard.vue'

const menuStore = useMenuStore()

const validMenus = computed(() =>
  menuStore.menus.filter(menu => menu.menu_id !== null)
)
</script>

<style scoped>
.rating-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.card-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  padding: 0 16px;
  margin: 0 auto;
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
  margin-bottom: 8px;
}
</style>