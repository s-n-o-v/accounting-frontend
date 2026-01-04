<!-- UserMenu.vue - Меню пользователя с аватаром и выпадающим списком -->
<template>
  <div class="relative">
    <!-- Кнопка с аватаром пользователя -->
    <Button
      icon="pi pi-user"
      severity="secondary"
      size="small"
      class="user-menu-button"
      aria-label="User menu"
      @click="toggleMenu"
    />

    <!-- Выпадающее меню -->
    <OverlayPanel
      ref="menu"
      class="user-menu-overlay"
      :showCloseIcon="false"
      :dismissable="true"
    >
      <div class="flex flex-col space-y-2 p-2 w-48">
        <!-- Профиль пользователя -->
        <div class="flex items-center space-x-2 p-2 border-b border-surface-border">
          <Avatar
            icon="pi pi-user"
            class="bg-primary text-white"
            size="normal"
          />
          <div>
            <div class="font-medium">Пользователь</div>
            <div class="text-sm text-surface-500">user@example.com</div>
          </div>
        </div>

        <!-- Пункты меню -->
        <Button
          label="Профиль"
          icon="pi pi-user-edit"
          severity="secondary"
          size="small"
          class="justify-start"
          @click="navigateToProfile"
        />

        <Button
          label="Настройки"
          icon="pi pi-cog"
          severity="secondary"
          size="small"
          class="justify-start"
          @click="navigateToSettings"
        />

        <Button
          label="Выйти"
          icon="pi pi-sign-out"
          severity="danger"
          size="small"
          class="justify-start"
          @click="logout"
        />
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import Avatar from 'primevue/avatar'

const menu = ref()
const router = useRouter()

const toggleMenu = (event: Event) => {
  menu.value.toggle(event)
}

const navigateToProfile = () => {
  router.push('/settings/profile')
  menu.value.hide()
}

const navigateToSettings = () => {
  router.push('/settings')
  menu.value.hide()
}

const logout = () => {
  // Логика выхода из системы
  console.log('Logout clicked')
  router.push('/login')
  menu.value.hide()
}
</script>

<style scoped>
.user-menu-button {
  transition: all 0.3s ease;
}

.user-menu-button:hover {
  transform: scale(1.05);
}

:deep(.p-overlaypanel) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--surface-border);
  background-color: var(--surface-card);
}

.dark :deep(.p-overlaypanel) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
