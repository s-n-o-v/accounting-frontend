<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-surface">
    <div class="bg-surface-card p-8 rounded-lg shadow-md w-full max-w-md border border-surface-border">
      <h1 class="text-2xl font-bold text-center mb-6">Вход в систему</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-primary mb-1">Email</label>
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
          <label for="password" class="block text-sm font-medium text-primary mb-1">Пароль</label>
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
            <label for="remember" class="text-sm text-muted">Запомнить меня</label>
          </div>
        </div>

        <Button
          type="submit"
          label="Войти"
          class="w-full"
          :loading="loading"
          severity="primary"
        />

        <div v-if="error" class="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded text-danger text-sm">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useApi } from '~/composables/api/useApi'

definePageMeta({
  layout: 'empty' // Use empty layout instead of false
})

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
    window.location.href = '/' // Use direct navigation to ensure full page reload
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
