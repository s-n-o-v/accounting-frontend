/**
 * Pinia store for sidebar state management
 * Provides centralized state management for sidebar visibility
 */
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isExpanded: true
  }),
  actions: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded
    },
    setSidebarExpanded(expanded: boolean) {
      this.isExpanded = expanded
    }
  },
  getters: {
    sidebarState: (state) => state.isExpanded
  }
})
