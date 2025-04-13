<template>
  <v-app>
    <v-main>
      <v-container
        class="d-flex justify-center align-center"
        style="min-height: 100vh;"
        fluid
      >
        <div class="w-100" style="max-width: 400px;">
          <!-- 로그인 컴포넌트 -->
          <AdminLogin v-if="!isLoggedIn" @login-success="onLoginSuccess" />

          <!-- 로그인 이후 화면 -->
          <template v-else>
            <!-- 토글 + 로그아웃 버튼 한 줄 배치 -->
            <div class="d-flex justify-space-between align-center mb-4">
              <v-btn-toggle v-model="mode" mandatory>
                <v-btn value="create">메뉴 등록</v-btn>
                <v-btn value="edit">메뉴 수정</v-btn>
              </v-btn-toggle>
              <v-btn color="error" @click="logout" class="ml-4">로그아웃</v-btn>
            </div>

            <!-- 등록/수정 컴포넌트 -->
            <AdminMenuCreate v-if="mode === 'create'" />
            <AdminMenuEdit v-else />
          </template>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import AdminLogin from '../components/AdminLogin.vue'
import AdminMenuCreate from '../components/AdminMenuCreate.vue'
import AdminMenuEdit from '../components/AdminMenuEdit.vue'

const isLoggedIn = ref(!!localStorage.getItem('token'))
const mode = ref('create')

const onLoginSuccess = () => {
  isLoggedIn.value = true
}

const logout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
}
</script>
