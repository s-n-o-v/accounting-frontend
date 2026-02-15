<template>
  <div class="directory-selector">
    <div class="p-inputgroup mb-4">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="Поиск..."
          @input="handleSearch"
          class="w-full"
        />
      </span>
    </div>
    
    <DataTable
      :value="filteredEntities"
      size="small"
      :loading="loading"
      tableStyle="min-width: 50rem"
      selection-mode="single"
      :selection="selectedItem"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      class="directory-table"
      data-key="id"
    >
      <template #header>
        <div class="table-header font-bold">
          {{ title }}
        </div>
      </template>
      
      <template #loading>
        Данные загружаются. Пожалуйста подождите.
      </template>
      
      <template #empty>
        Данные отсутствуют
      </template>
      
      <Column
        v-for="col of columns"
        :key="col.key"
        :field="col.key"
        :header="col.label"
        :sortable="!!col.sortable"
        :exportable="!!col.exportable"
      >
        <template #body="slotProps">
          <Badge v-if="col.type === 'badge'" :severity="stateType(slotProps.data.state.id)">
            {{ slotProps.data.state.name }}
          </Badge>
          <span v-else>{{ slotProps.data[col.key] }}</span>
        </template>
      </Column>
    </DataTable>
    
    <div class="action-buttons mt-4">
      <Button
        label="Добавить"
        icon="pi pi-plus"
        severity="success"
        @click="onAddNew"
        class="add-button"
      />
      <Button
        label="Выбрать"
        icon="pi pi-check"
        :disabled="!selectedItem"
        @click="onSelect"
        class="select-button ml-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  exportable?: boolean;
  type?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface Props {
  columns: ColumnConfig[];
  entities: any[];
  loading: boolean;
  title: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', value: any): void;
  (e: 'add-new'): void;
}>();

// Локальное состояние для поиска
const searchQuery = ref('');

// Локальное состояние для выбранного элемента
const selectedItem = ref<any>(null);

// Фильтрация сущностей на основе поискового запроса
const filteredEntities = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.entities;
  }
  
  const query = searchQuery.value.toLowerCase();
  return props.entities.filter(entity => {
    return Object.values(entity).some(value => 
      String(value).toLowerCase().includes(query)
    );
  });
});

// Обработка выбора строки
const onRowSelect = (event: any) => {
  selectedItem.value = event.data;
};

// Обработка отмены выбора строки
const onRowUnselect = () => {
  selectedItem.value = null;
};

// Обработка нажатия на кнопку "Выбрать"
const onSelect = () => {
  if (selectedItem.value) {
    emit('select', selectedItem.value);
  }
};

// Обработка нажатия на кнопку "Добавить"
const onAddNew = () => {
  emit('add-new');
};

// Обработка поиска
const handleSearch = () => {
  // selectedItem обнуляется при изменении поискового запроса
  selectedItem.value = null;
};

// Функция для определения типа состояния (если используется)
const stateType = (id: number) => {
  switch (id) {
    case 1:
      return 'success';
    case 2:
      return 'danger';
    case 3:
      return 'warn';
    default:
      return 'info';
  }
};
</script>

<style scoped>
.directory-selector {
  padding: 1rem;
}

.search-input {
  flex-grow: 1;
}

.table-header {
  font-size: 1.2rem;
  font-weight: bold;
  padding-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.add-button {
  flex: 1;
  margin-right: 0.5rem;
}

.select-button {
  flex: 1;
  margin-left: 0.5rem;
}

.directory-table {
  width: 100%;
  margin-bottom: 1rem;
}
</style>