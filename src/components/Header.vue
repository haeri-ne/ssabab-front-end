<template>
  <v-app-bar app flat elevation="0" class="header-bar">
    <v-container class="d-flex justify-between align-center py-2" fluid>
      
      <!-- 햄버거 버튼 -->
      <v-app-bar-nav-icon
        @click="$emit('toggle-sidebar')"
        color="black"
        class="me-2"
      />

      <!-- 가운데 제목 + 날짜 -->
      <div class="d-flex flex-column align-center justify-center text-center flex-grow-1">
        <h3 class="header-title">SSABAB</h3>
        <p v-if="isMenusPage" class="header-date">
          {{ dateStore.menusDate }}
        </p>
      </div>

      <!-- 오른쪽: 달력 아이콘 또는 placeholder -->
      <v-menu
        v-if="isMenusPage"
        v-model="calendarOpen"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290"
        min-width="290"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-calendar"
            size="28"
            class="cursor-pointer"
            color="black"
          />
        </template>

        <v-date-picker
          v-model="selectedDate"
          locale="ko"
        />
      </v-menu>

      <!-- 메뉴 페이지가 아닐 경우 우측 공간 확보 -->
      <div
        v-else
        style="width: 48px; height: 48px; visibility: hidden;"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { getOrCreateUUID } from '../utils/uuidUtil'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const isMenusPage = computed(() => route.path.startsWith('/menus/'))
const pageName = computed(() => isMenusPage.value ? 'menus_view' : '')

const dateStore = useDateStore()
const logStore = useLogStore()

const logClickCalendar = () => {
  logStore.addLog({
    user_id: getOrCreateUUID(),
    event_name: 'click_calendar',
    event_value: { selected_date: dateStore.menusDate },
    page_name: pageName.value,
    event_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
}

const calendarOpen = ref(false)

// Date 객체를 받아서 YYYY-MM-DD 형식으로 store에 저장
const selectedDate = computed({
  get: () => new Date(dateStore.menusDate),
  set: (val) => {
    const formatted = dayjs(val).format('YYYY-MM-DD')
    if (formatted !== dateStore.menusDate) {
      dateStore.setMenusDate(formatted)

      logClickCalendar()

      router.push({ 
        name: 'menus', 
        params: { date: formatted } 
      })
    }

    calendarOpen.value = false
  }
})
</script>

<style scoped>
.header-bar {
  background-color: white !important;
  border-bottom: 1px solid #e0e0e0;
}

.header-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #212121;
  font-family: 'Pretendard Variable', sans-serif;
  margin-bottom: 0.2rem;
}

.header-date {
  font-size: 0.85rem;
  color: #666;
  font-family: 'Pretendard Variable', sans-serif;
  margin: 0;
}

@media (max-width: 576px) {
  .header-title {
    font-size: 1.1rem;
  }

  .header-date {
    font-size: 0.75rem;
  }
}
</style>
