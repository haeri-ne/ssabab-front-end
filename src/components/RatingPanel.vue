<template>
  <div class="rating-panel">
    <p class="instruction">드신 메뉴를 눌러 별점을 남겨주세요!</p>

    <div class="card-grid">
      <MenuCard
        v-for="(menu, index) in validMenus"
        :key="menu.menu_id + '-' + dateStore.menusDate"
        :menu="menu"
        :menuIndex="index"
        :isVote="false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDateStore } from '../store/dateStore'
import { useMenuStore } from '../store/menuStore'
import MenuCard from './MenuCard.vue'

const dateStore = useDateStore()
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

.instruction {
  font-size: 0.9rem;
  color: #444;
  text-align: center;
  margin-bottom: 8px;
}

.card-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
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
</style>
