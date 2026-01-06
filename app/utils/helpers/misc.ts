// Форматирование даты
export const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Форматирование типа клиента
export const formatClientType = (type: string) => {
  const typeMap: Record<string, string> = {
    OOO: 'ООО',
    IP: 'ИП',
    AO: 'АО',
    NKO: 'НКО'
  }
  return typeMap[type] || type
}

// Форматирование статуса
export const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активен',
    suspended: 'Приостановлен',
    closed: 'Закрыт'
  }
  return statusMap[status] || status
}
export const statusNum = (status: string): number => {
  const statusMap: Record<string, number> = {
    active: 1,
    suspended: 2,
    closed: 3
  }
  return statusMap[status] || 3
}

// Форматирование денежных сумм
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

