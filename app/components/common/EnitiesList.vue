<script setup lang="ts">
interface Props {
  columns: any[];
  actions: any[];
  entities: any;
  loading: boolean;
  hasCreate: boolean;
  title: string;
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'create'): void
  (e: 'view', value: string | number): void
  (e: 'edit', value: string | number): void
  (e: 'delete', value: string | number): void
  (e: 'page', page: number): void
  (e: 'filter', keyword: string): void
}>()

const rowsCount = computed(() => props.entities?.meta?.per_page ?? 0)
const rowsTotal = computed(() => props.entities?.meta?.total ?? 0)
const stateType = (id) => {
  switch (id) {
    case 1:
      return 'success'
    case 2:
      return 'danger'
    case 3:
      return 'warn'
  }
}

const onCreate = () => emit('create')
const setPage = (e) => emit('page', e.page)
const actionsClick = (type: string, id: number) => emit(type, id)
</script>

<template>
  <div class="card bg-header bg-surface-card rounded-lg p-4">
    <Toolbar v-if="hasCreate" class="mb-6">
      <template #start>
        <Button
          label="Добавить"
          icon="pi pi-plus"
          severity="success"
          class="mr-2"
          @click="onCreate"
        />
      </template>
    </Toolbar>
    <DataTable :value="props.entities?.data" :loading="props.loading" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <span class="text-xl font-bold">{{ title }}</span>
        </div>
      </template>
      <template #loading> Данные загружаются. Пожалуйста подождите. </template>
      <template #empty>Данные отсутствуют</template>
      <Column
        v-for="col of columns"
        :key="col.key"
        :field="col.key"
        :header="col.label"
        :sortable="!!col.sortable"
        :exportable="!!col.exportable"
      >
        <template #body="slotProps">
          <Badge v-if="col.type === 'badge'" :severity="stateType(slotProps.data.state.id)">{{ slotProps.data.state.name }}</Badge>
          <span v-else>{{ slotProps.data[col.key] }}</span>
        </template>
      </Column>
      <Column v-if="props.actions?.length" :exportable="false" style="width: 12rem">
        <template #body="slotProps">
          <Button
            v-for="act in props.actions"
            :key="act.label"
            :icon="act.icon"
            outlined
            rounded
            class="ml-2"
            @click="actionsClick(act.type, slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
    <Paginator
      :rows="rowsCount"
      :totalRecords="rowsTotal"
      @page="setPage"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
