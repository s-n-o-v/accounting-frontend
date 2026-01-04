<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6 text-black">Вход в систему</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            class="w-full"
            placeholder="Введите email"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <Password
            id="password"
            v-model="password"
            placeholder="Введите пароль"
            :feedback="false"
            toggleMask
            fluid
            required
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Checkbox id="remember" v-model="rememberMe" :binary="true" class="mr-2" />
            <label for="remember" class="text-sm text-gray-600">Запомнить меня</label>
          </div>
        </div>

        <Button
          type="submit"
          label="Войти"
          class="w-full"
          :loading="loading"
          severity="primary"
        />

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/api/useApi'

const email = ref('admin@example.com')
const password = ref('password')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const { post } = useApi()

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    // Attempt login
    const response = await post('/auth/login', {
      email: email.value,
      password: password.value
    })

    // Login successful, redirect to dashboard
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.statusCode !== 401 ? err.message : 'Ошибка авторизации. Проверьте email и пароль.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
