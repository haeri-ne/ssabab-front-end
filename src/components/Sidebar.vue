<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    class="custom-sidebar"
    elevation="24"
    width="260"
    disable-resize-watcher
    touchless
  >
    <!-- 상단 햄버거 아이콘 -->
    <div class="d-flex align-center px-4 py-3">
      <v-app-bar-nav-icon @click="drawer = false" />
      <span class="ms-2 font-weight-bold">메뉴</span>
    </div>

    <v-divider class="my-1" />

    <!-- 메뉴 항목 -->
    <v-list nav dense>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        link
        exact
        active-class="active-link"
      >
        <v-icon start>{{ item.icon }}</v-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
  
<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const drawer = ref(props.modelValue)
watch(() => props.modelValue, val => drawer.value = val)
watch(drawer, val => emit('update:modelValue', val))

const today = dayjs().format('YYYY-MM-DD')

const menuItems = computed(() => [
  { title: '홈으로 가기', to: '/home', icon: 'mdi-home' },
  { title: 'SSABAB', to: `/menus/${today}`, icon: 'mdi-silverware-fork-knife' },
  { title: 'SSAFE', to: '/ssafe', icon: 'mdi-coffee' },
  { title: '분석 보러 가기', to: `/analytics/${today}`, icon: 'mdi-chart-box' },
  { title: '로그인&회원가입', to: '/auth', icon: 'mdi-account' },
])
</script>

<style scoped>
.active-link {
  background-color: #E3F2FD;
  color: #1976D2;
  font-weight: bold;
}

.custom-sidebar {
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transform: translateX(-100%); /* 닫혀 있을 때 완전히 숨김 */
  transition: transform 0.3s ease;
}

/* Vuetify가 drawer 열 때 내부 클래스 붙여주므로 이걸로 제어 */
.v-navigation-drawer:not(.v-navigation-drawer--active) {
display: none !important;
}

</style>
