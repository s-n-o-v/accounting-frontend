/**
 * Composables for sidebar state management
 * DEPRECATED: Use Pinia store instead (useSidebarStore)
 * Kept for backward compatibility
 */
import { useState } from '#imports'

export const useSidebar = () => {
  const isSidebarExpanded = useState<boolean>('sidebar-expanded', () => true)

  const toggleSidebar = () => {
    isSidebarExpanded.value = !isSidebarExpanded.value
  }

  const setSidebarExpanded = (expanded: boolean) => {
    isSidebarExpanded.value = expanded
  }

  return {
    isSidebarExpanded,
    toggleSidebar,
    setSidebarExpanded
  }
}
