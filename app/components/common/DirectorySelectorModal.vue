<template>
  <Dialog 
    v-model:visible="displayModal" 
    :style="{ width: '80vw' }" 
    header="Выбор из справочника"
    :modal="true"
    class="directory-selector-modal"
    @hide="onCancel"
  >
    <DirectorySelector
      :columns="columns"
      :entities="entities"
      :loading="loading"
      :title="title"
      @select="onSelect"
      @add-new="onAddNew"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

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
  modelValue: boolean;
  columns: ColumnConfig[];
  entities: any[];
  loading: boolean;
  title: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  loading: false,
  title: 'Выбор из справочника'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', value: any): void;
  (e: 'add-new'): void;
  (e: 'cancel'): void;
}>();

const displayModal = ref(props.modelValue);

// Следим за изменениями в модели и обновляем локальное состояние
watch(() => props.modelValue, (newValue) => {
 displayModal.value = newValue;
});

// Следим за изменениями в локальном состоянии и обновляем модель
watch(displayModal, (newValue) => {
  emit('update:modelValue', newValue);
});

const onSelect = (value: any) => {
  emit('select', value);
  displayModal.value = false; // Закрываем модальное окно после выбора
};

const onAddNew = () => {
  emit('add-new');
  displayModal.value = false; // Закрываем модальное окно после добавления
};

const onCancel = () => {
  emit('cancel');
  displayModal.value = false;
};
</script>

<style scoped>
.directory-selector-modal :deep(.p-dialog-content) {
  padding: 0;
}
</style>