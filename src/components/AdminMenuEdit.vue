<template>
  <v-card class="pa-5" elevation="2" max-width="600" rounded="xl">
    <h3 class="text-center mb-4">메뉴 수정</h3>
    <v-text-field
      v-model="selectedDate"
      label="날짜 선택"
      type="date"
      @change="fetchMenus"
      class="mb-4"
    />

    <v-row v-for="(menu, menuIndex) in menus" :key="menuIndex">
      <v-col cols="12">
        <h4 class="mb-2">메뉴 {{ menuIndex + 1 }}</h4>
        <v-text-field
          v-for="(food, foodIndex) in menu.foods"
          :key="foodIndex"
          v-model="menus[menuIndex].foods[foodIndex].name"
          :label="`음식 ${foodIndex + 1}`"
          class="mb-2"
        />
      </v-col>
    </v-row>

    <v-btn block color="primary" class="mt-4" @click="submitChanges">
      수정 제출
    </v-btn>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const selectedDate = ref('')
const menus = ref([])
const originalMenus = ref([])
const token = localStorage.getItem('token')

// 빈 메뉴 생성 함수
const createEmptyMenu = () => ({
  menu_id: null,
  foods: Array.from({ length: 6 }, () => ({ id: null, name: '' }))
})

const fetchMenus = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/${selectedDate.value}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const loadedMenus = res.data.map(menu => {
      const foods = menu.foods.map(food => ({
        id: food.id ?? null,
        name: food.name ?? ''
      }))

      while (foods.length < 6) {
        foods.push({ id: null, name: '' }) // 빈 칸으로 채움
      }

      return {
        menu_id: menu.id ?? null,
        foods
      }
    })

    while (loadedMenus.length < 2) {
      loadedMenus.push(createEmptyMenu())
    }

    menus.value = loadedMenus
    originalMenus.value = JSON.parse(JSON.stringify(loadedMenus))
  } catch (err) {
    alert('메뉴 불러오기 실패')
  }
}

const submitChanges = async () => {
  const changes = []

  menus.value.forEach((menu, i) => {
    menu.foods.forEach((food, j) => {
      const original = originalMenus.value[i]?.foods[j]
      if (food.id && original && food.name !== original.name) {
        changes.push({ food_id: food.id, updated_name: food.name })
      }
    })
  })

  if (changes.length === 0) {
    return alert('수정된 항목이 없습니다.')
  }

  try {
    for (const change of changes) {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/foods/${change.food_id}`,
        { updated_name: change.updated_name },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
    }

    alert('수정 완료!')
    await fetchMenus()
  } catch {
    alert('수정 실패')
  }
}
</script>
