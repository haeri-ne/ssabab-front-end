<template>
  <v-card class="w-100 pa-5" max-width="400" elevation="2" rounded="xl">
    <h2 class="text-center text-h6 mb-5">관리자 로그인</h2>
    <v-text-field v-model="username" label="아이디" variant="outlined" hide-details class="mb-3" />
    <v-text-field v-model="password" label="비밀번호" type="password" variant="outlined" hide-details class="mb-5" />
    <v-btn block color="primary" @click="login">로그인</v-btn>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
const emit = defineEmits(['login-success'])

const username = ref('')
const password = ref('')

const login = async () => {
  try {
    const params = new URLSearchParams()
    params.append('username', username.value)
    params.append('password', password.value)
    params.append('grant_type', 'password')

    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/token`, params)
    localStorage.setItem('token', res.data.access_token)
    emit('login-success')
  } catch {
    alert('로그인 실패')
  }
}
</script>