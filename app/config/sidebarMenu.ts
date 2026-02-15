/**
 * Sidebar menu configuration
 * Defines the structure of the sidebar navigation
 */
export const sidebarMenu = [
  {
    id: "main",
    label: "Основное",
    items: [
      {
        id: "dashboard",
        label: "Дашборд",
        icon: "pi pi-fw pi-chart-line",
        to: "/",
      },
      {
        id: "clients",
        label: "Клиенты",
        icon: "pi pi-fw pi-users",
        to: "/clients",
      },
      {
        id: "calendar",
        label: "Календарь",
        icon: "pi pi-fw pi-calendar",
        to: "/calendar",
      },
    ]
  },
  {
    id: "reports",
    label: "Отчеты",
    items: [
      {
        id: "reports-main",
        label: "Основные отчеты",
        icon: "pi pi-fw pi-chart-bar",
        to: "/reports",
      },
      {
        id: "reports-financial",
        label: "Финансовые отчеты",
        icon: "pi pi-fw pi-dollar",
        to: "/reports/financial",
      },
      {
        id: "reports-analytics",
        label: "Аналитика",
        icon: "pi pi-fw pi-chart-pie",
        to: "/reports/analytics",
      },
    ]
  },
  {
    id: "services",
    label: "Услуги",
    items: [
      {
        id: "services-list",
        label: "Список услуг",
        icon: "pi pi-fw pi-list",
        to: "/services",
      },
      {
        id: "services-catalog",
        label: "Каталог",
        icon: "pi pi-fw pi-book",
        to: "/services/catalog",
      },
    ]
  },
  {
    id: "finance",
    label: "Финансы",
    items: [
      {
        id: "finance-overview",
        label: "Обзор",
        icon: "pi pi-fw pi-wallet",
        to: "/finance",
      },
      {
        id: "finance-invoices",
        label: "Счета",
        icon: "pi pi-fw pi-file",
        to: "/finance/invoices",
      },
      {
        id: "finance-payments",
        label: "Платежи",
        icon: "pi pi-fw pi-credit-card",
        to: "/finance/payments",
      },
    ]
  },
  {
    id: "directory",
    label: "Справочники",
    items: [
      {
        id: "directory-services",
        label: "Типы услуг",
        icon: "pi pi-fw pi-cog",
        to: "/directory/services",
      },
      {
        id: "report-types",
        label: "Типы отчетов",
        icon: "pi pi-fw pi-cog",
        to: "/directory/report-types",
      },
      {
        id: "agencies",
        label: "Органы власти",
        icon: "pi pi-fw pi-cog",
        to: "/directory/agencies",
      },
    ]
  },
  {
    id: "settings",
    label: "Настройки",
    items: [
      {
        id: "settings-profile",
        label: "Профиль",
        icon: "pi pi-fw pi-user",
        to: "/settings/profile",
      },
      {
        id: "settings-system",
        label: "Система",
        icon: "pi pi-fw pi-cog",
        to: "/settings",
      },
    ]
  }
]
