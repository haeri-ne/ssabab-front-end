<template>
  <v-app>
    <v-main>
      <v-container
        class="d-flex justify-center align-center"
        style="min-height: 100vh;"
        fluid
      >
        <v-card
          class="w-100 pa-5"
          max-width="400"
          elevation="2"
          rounded="xl"
        >
          <!-- 로그인 화면 -->
          <template v-if="!isLoggedIn">
            <h2 class="text-center text-h6 mb-5">관리자 로그인</h2>
            <v-text-field
              v-model="username"
              label="아이디"
              autocomplete="off"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            />
            <v-text-field
              v-model="password"
              label="비밀번호"
              type="password"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-5"
            />
            <v-btn block color="primary" @click="login">로그인</v-btn>
          </template>

          <!-- 식단 입력 화면 -->
          <template v-else>
            <h2 class="text-center text-h6 mb-4">식단 입력</h2>

            <v-text-field
              v-model="date"
              label="날짜 선택"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-4"
            />

            <v-row dense>
              <v-col cols="12">
                <h4 class="text-subtitle-2 font-weight-medium mb-2">메뉴 1</h4>
                <v-text-field
                  v-for="(value, index) in inputs1"
                  :key="index"
                  v-model="inputs1[index]"
                  placeholder="음식 입력"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mb-2"
                />
              </v-col>

              <v-col cols="12" class="mt-2">
                <h4 class="text-subtitle-2 font-weight-medium mb-2">메뉴 2</h4>
                <v-text-field
                  v-for="(value, index) in inputs2"
                  :key="index"
                  v-model="inputs2[index]"
                  placeholder="음식 입력"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mb-2"
                />
              </v-col>
            </v-row>

            <v-btn block color="primary" class="mt-4 mb-2" @click="submitData">제출</v-btn>
            <v-btn block variant="outlined" color="secondary" @click="logout">로그아웃</v-btn>
          </template>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// 로그인 관련 상태
const isLoggedIn = ref(false)
const username = ref('')
const password = ref('')
const token = ref('')

// 로그인 요청
const login = async () => {
  try {
    const params = new URLSearchParams()
    params.append('username', username.value)
    params.append('password', password.value)
    params.append('grant_type', 'password')

    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/token`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    token.value = res.data.access_token
    localStorage.setItem('token', token.value)
    isLoggedIn.value = true
    username.value = ''
    password.value = ''
  } catch (err) {
    alert('아이디 또는 비밀번호가 틀렸습니다.')
  }
}

// 로그아웃
const logout = () => {
  isLoggedIn.value = false
  token.value = ''
  localStorage.removeItem('token')
}

// 로그인 유지
onMounted(() => {
  const saved = localStorage.getItem('token')
  if (saved) {
    token.value = saved
    isLoggedIn.value = true
  }
})

// 식단 입력 관련 상태
const date = ref('')
const inputs1 = ref(Array(6).fill(''))
const inputs2 = ref(Array(6).fill(''))

const foods1 = computed(() => inputs1.value.filter(v => v.trim() !== ''))
const foods2 = computed(() => inputs2.value.filter(v => v.trim() !== ''))

// 제출
const submitData = async () => {
  if (!date.value) {
    alert('날짜를 선택해주세요.')
    return
  }

  const hasEmpty = inputs1.value.includes('') || inputs2.value.includes('')
  if (hasEmpty && !confirm('메뉴를 모두 입력하지 않았습니다. 그래도 제출하시겠습니까?')) return

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/menus/`

  try {
    await axios.post(API_URL, { foods: foods1.value, date: date.value }, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    await axios.post(API_URL, { foods: foods2.value, date: date.value }, {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    alert('제출 성공!')
    date.value = ''
    inputs1.value = Array(6).fill('')
    inputs2.value = Array(6).fill('')
  } catch (error) {
    alert('제출 실패! 인증 정보를 확인하세요.')
  }
}
</script>
