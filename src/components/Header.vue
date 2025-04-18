<template>
  <v-app-bar app flat elevation="0" class="header-bar">
    <v-container class="d-flex justify-between align-center py-2" fluid>

      <!-- 햄버거 아이콘 -->
      <v-app-bar-nav-icon
        @click="$emit('toggle-sidebar')"
        color="black"
        class="me-2"
      />

      <!-- 제목 + 날짜 -->
      <div class="d-flex flex-column align-center justify-center text-center flex-grow-1">
        <h3 class="header-title">SSABAB</h3>
        <p v-if="isMenusPage" class="header-date">
          {{ dateStore.date }}
        </p>
      </div>

      <!-- 오른쪽 캘린더 아이콘 OR placeholder -->
      <v-menu
        v-if="isMenusPage"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-calendar"
            size="28"
            class="cursor-pointer"
            color="black"
          ></v-icon>
        </template>
        <v-date-picker
          v-model="selectedDate"
          @update:model-value="onDateChange"
          color="primary"
          locale="ko"
        ></v-date-picker>
      </v-menu>

      <!-- 메뉴 페이지가 아닐 경우 우측 공간 확보 -->
      <div
        v-else
        style="width: 48px; height: 48px; visibility: hidden;"
      ></div>

    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { toKSTDateTime } from '../utils/timeUtil'
import { getOrCreateUUID } from '../utils/uuidUtil'

const route = useRoute()
const router = useRouter()

const isMenusPage = computed(() => route.path.startsWith('/menus/'))

const dateStore = useDateStore()
const logStore = useLogStore()
const menu = ref(false)

const selectedDate = computed({
  get: () => dateStore.date,
  set: (val) => {
    dateStore.setDate(val)
  }
})

const lastSelectedDate = ref(dateStore.date)
const uuid = getOrCreateUUID()

const onDateChange = (newDate) => {
  const formatted = new Date(newDate)

  if (formatted && formatted !== lastSelectedDate.value) {
    dateStore.setDate(formatted)
    lastSelectedDate.value = dateStore.date

    logStore.addLog({
      user_id: uuid,
      event_name: 'click_calendar',
      event_value: { selected_date: dateStore.date },
      page_name: route.name || '',
      event_time: toKSTDateTime(new Date()),
    })

    router.push({ name: 'menus', params: { date: dateStore.date } })
  }

  menu.value = false
}
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
