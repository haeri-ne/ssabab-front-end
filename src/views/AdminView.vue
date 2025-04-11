<template>
  <v-app>
    <v-main>
      <v-container class="py-10">
        <AdminLogin v-if="!isLoggedIn" @login-success="onLoginSuccess" />
        <template v-else>
          <v-btn-toggle v-model="mode" class="mb-6" mandatory>
            <v-btn value="create">메뉴 등록</v-btn>
            <v-btn value="edit">메뉴 수정</v-btn>
          </v-btn-toggle>
          <AdminMenuCreate v-if="mode === 'create'" />
          <AdminMenuEdit v-else />
        </template>
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
</script>