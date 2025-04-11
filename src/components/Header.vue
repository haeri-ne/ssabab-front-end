<template>
  <div class="bg-primary text-white sticky-top shadow-sm">
    <div class="d-flex justify-between align-center px-4 py-3">
      <!-- 홈 아이콘 -->
      <v-icon
        icon="mdi-home"
        size="35"
        class="cursor-pointer"
        @click="goToHome"
      ></v-icon>

      <!-- 제목 + 날짜 -->
      <div class="d-flex flex-column align-center justify-center text-center flex-grow-1">
        <h3 class="mb-1 fw-bold title-text">
          SSAFY 대전캠퍼스 식단표
        </h3>
        <p class="text-white text-opacity-75 mb-0">
          {{ dateStore.date }}
        </p>
      </div>

      <!-- 캘린더 아이콘 + Vuetify 날짜 선택 -->
      <v-menu
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
            size="35"
            class="cursor-pointer"
          ></v-icon>
        </template>
        <v-date-picker
          v-model="selectedDate"
          @update:model-value="onDateChange"
          color="primary"
          locale="ko"
        ></v-date-picker>
      </v-menu>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDateStore } from '../store/dateStore'
import { useLogStore } from '../store/logStore'
import { toKSTDateTime } from '../utils/timeUtil'
import { getOrCreateUUID } from '../utils/uuidUtil'

const router = useRouter()

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

const url = window.location.href
const page_name = ref(
  url.includes('menus') ? 'menus_view' :
  url.includes('review') ? 'review_view' :
  ''
)

const uuid = getOrCreateUUID()

// 홈 버튼 클릭
const goToHome = () => {
  dateStore.setDate(new Date())
  selectedDate.value = dateStore.date

  logStore.addLog({
    user_id: uuid,
    event_name: 'click_home_button',
    event_value: {},
    page_name: page_name.value,
    event_time: toKSTDateTime(new Date()),
  })

  router.push({ name: 'menus', params: { date: dateStore.date } })
}

// 날짜 변경 시 동작
const onDateChange = (newDate) => {
  const formatted = new Date(newDate)

  if (formatted && formatted !== lastSelectedDate.value) {
    dateStore.setDate(formatted)
    lastSelectedDate.value = dateStore.date

    logStore.addLog({
      user_id: uuid,
      event_name: 'click_calendar',
      event_value: { selected_date: dateStore.date },
      page_name: page_name.value,
      event_time: toKSTDateTime(new Date()),
    })

    router.push({ name: 'menus', params: { date: dateStore.date } })
  }

  menu.value = false
}
</script>

<style scoped>
.title-text {
  white-space: nowrap;
  font-size: 1.5rem;
}

@media (max-width: 576px) {
  .title-text {
    font-size: 1.1rem;
  }
}
</style>
