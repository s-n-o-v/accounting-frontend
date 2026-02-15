<template>
  <div class="card bg-header bg-surface-card rounded-lg p-4 m-4">
    <h2>Тестирование DirectorySelector</h2>
    
    <div class="p-inputgroup mb-4">
      <Button 
        label="Открыть выбор из справочника" 
        icon="pi pi-search"
        @click="openModal"
        class="mr-2"
      />
    </div>
    
    <div v-if="selectedItem" class="selected-item-display mt-4 p-4 bg-blue-50 border-round">
      <h3>Выбранный элемент:</h3>
      <pre>{{ JSON.stringify(selectedItem, null, 2) }}</pre>
    </div>
    
    <DirectorySelectorModal
      v-model="showModal"
      :columns="columns"
      :entities="entities"
      :loading="loading"
      title="Выберите агентство"
      @select="onSelect"
      @add-new="onAddNew"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

// Состояние для модального окна
const showModal = ref(false);

// Состояние для выбранных данных
const selectedItem = ref<any>(null);

// Состояние загрузки
const loading = ref(false);

// Колонки для таблицы
const columns = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    exportable: true,
  },
  {
    key: 'name',
    label: 'Наименование',
    sortable: true,
    exportable: true,
  },
  {
    key: 'code',
    label: 'Код',
    sortable: true,
    exportable: true,
  },
  {
    key: 'type',
    label: 'Тип',
    sortable: true,
    exportable: true,
  }
];

// Тестовые данные
const entities = ref([
  { id: 1, name: 'Министерство финансов', code: 'MF', type: 'Государственное учреждение' },
  { id: 2, name: 'Федеральная налоговая служба', code: 'FNS', type: 'Федеральная служба' },
  { id: 3, name: 'Федеральная таможенная служба', code: 'FTS', type: 'Федеральная служба' },
  { id: 4, name: 'Центральный банк РФ', code: 'CBR', type: 'Банк' },
  { id: 5, name: 'Министерство экономического развития', code: 'MER', type: 'Государственное учреждение' },
]);

// Открытие модального окна
const openModal = () => {
  showModal.value = true;
};

// Обработка выбора элемента
const onSelect = (value: any) => {
  selectedItem.value = value;
  console.log('Выбран элемент:', value);
};

// Обработка добавления нового элемента
const onAddNew = () => {
  console.log('Запрос на добавление нового элемента');
  // Здесь можно открыть форму создания нового элемента
 alert('Добавление нового элемента');
};

// Обработка отмены
const onCancel = () => {
  console.log('Операция отменена');
};

// Имитация загрузки данных
const loadData = async () => {
  loading.value = true;
  try {
    // Имитация задержки для демонстрации состояния загрузки
    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    loading.value = false;
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.selected-item-display {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>