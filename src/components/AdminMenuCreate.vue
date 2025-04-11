<template>
  <v-card class="pa-5" elevation="2" max-width="600" rounded="xl">
    <h3 class="text-center mb-4">메뉴 등록</h3>
    <v-text-field v-model="date" label="날짜 선택" type="date" class="mb-4" />
    <v-row dense>
      <v-col cols="12">
        <h4 class="mb-2">메뉴 1</h4>
        <v-text-field v-for="(v, i) in inputs1" :key="i" v-model="inputs1[i]" placeholder="음식 입력" class="mb-2" />
      </v-col>
      <v-col cols="12">
        <h4 class="mb-2">메뉴 2</h4>
        <v-text-field v-for="(v, i) in inputs2" :key="i" v-model="inputs2[i]" placeholder="음식 입력" class="mb-2" />
      </v-col>
    </v-row>
    <v-btn block color="primary" class="mt-4" @click="submitData">제출</v-btn>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const date = ref('')
const inputs1 = ref(Array(6).fill(''))
const inputs2 = ref(Array(6).fill(''))
const token = localStorage.getItem('token')

const submitData = async () => {
  if (!date.value) return alert('날짜 선택 필수')
  const foods1 = inputs1.value.filter(v => v.trim())
  const foods2 = inputs2.value.filter(v => v.trim())
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/`, { foods: foods1, date: date.value }, { headers: { Authorization: `Bearer ${token}` } })
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/`, { foods: foods2, date: date.value }, { headers: { Authorization: `Bearer ${token}` } })
    alert('제출 성공!')
    date.value = ''
    inputs1.value = Array(6).fill('')
    inputs2.value = Array(6).fill('')
  } catch {
    alert('제출 실패')
  }
}
</script>