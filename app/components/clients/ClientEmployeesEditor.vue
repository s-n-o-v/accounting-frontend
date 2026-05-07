<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClientEmployee } from '~/composables/api/useClientEmployeesApi'
import { formatDate } from '~/utils/helpers/misc'

interface EmployeeFormItem extends Omit<ClientEmployee, 'id' | 'client_id' | 'hired_at' | 'fired_at'> {
  id: number
  client_id?: number
  hired_at?: string | null
  fired_at?: string | null
}

const props = defineProps<{
  modelValue: ClientEmployee[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ClientEmployee[]]
}>()

// Варианты гражданства (только РФ и Иностранный гражданин)
const citizenshipOptions = [
  { label: 'РФ', value: 'russian' },
  { label: 'Иностранный гражданин', value: 'foreign' }
]

const employmentTypeOptions = [
  { label: 'Основное место', value: 'staff' },
  { label: 'ГПХ', value: 'civil_contract' }
]

const localEmployees = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const validationError = ref<string | null>(null)

const employeeForm = ref<EmployeeFormItem>({
  id: 0,
  full_name: '',
  citizenship: 'russian',
  employment_type: 'staff',
  position: '',
  hired_at: null,
  fired_at: null
})

const getCitizenshipLabel = (value: string) =>
  citizenshipOptions.find(o => o.value === value)?.label ?? value

const getEmploymentTypeLabel = (value: string) =>
  employmentTypeOptions.find(o => o.value === value)?.label ?? value

const openAddDialog = () => {
  dialogMode.value = 'add'
  employeeForm.value = {
    id: 0,
    full_name: '',
    citizenship: 'russian',
    employment_type: 'staff',
    position: '',
    hired_at: null,
    fired_at: null
  }
  validationError.value = null
  dialogVisible.value = true
}

const openEditDialog = (emp: ClientEmployee) => {
  dialogMode.value = 'edit'
  employeeForm.value = {
    ...emp,
    id: emp.id,
    hired_at: emp.hired_at ?? null,
    fired_at: emp.fired_at ?? null
  }
  validationError.value = null
  dialogVisible.value = true
}

const saveEmployee = () => {
  if (!employeeForm.value.full_name?.trim()) {
    validationError.value = 'ФИО обязательно для заполнения'
    return
  }

  const item: ClientEmployee = {
    id: employeeForm.value.id,
    client_id: employeeForm.value.client_id ?? 0,
    full_name: employeeForm.value.full_name.trim(),
    citizenship: employeeForm.value.citizenship,
    employment_type: employeeForm.value.employment_type,
    position: employeeForm.value.position?.trim() || undefined,
    hired_at: employeeForm.value.hired_at?.trim() || undefined,
    fired_at: employeeForm.value.fired_at?.trim() || undefined
  }

  const list = [...localEmployees.value]

  if (dialogMode.value === 'add') {
    list.push({ ...item, id: -Date.now() })
  } else {
    const idx = list.findIndex(e => e.id === employeeForm.value.id)
    if (idx >= 0) list[idx] = item
  }

  localEmployees.value = list
  dialogVisible.value = false
}

const removeEmployee = (emp: ClientEmployee) => {
  if (!confirm(`Удалить сотрудника ${emp.full_name}?`)) return
  localEmployees.value = localEmployees.value.filter(e => e !== emp)
}
</script>

<template>
  <div class="client-employees-editor">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Сотрудники</h3>
      <Button
        label="Добавить сотрудника"
        icon="pi pi-plus"
        size="small"
        @click="openAddDialog"
      />
    </div>

    <DataTable
      v-if="localEmployees.length > 0"
      :value="localEmployees"
      :row-hover="true"
      class="p-datatable-sm"
    >
      <Column field="full_name" header="ФИО" />
      <Column field="position" header="Должность">
        <template #body="{ data }">
          {{ data.position || '—' }}
        </template>
      </Column>
      <Column field="citizenship" header="Гражданство">
        <template #body="{ data }">
          {{ getCitizenshipLabel(data.citizenship) }}
        </template>
      </Column>
      <Column field="employment_type" header="Тип занятости">
        <template #body="{ data }">
          {{ getEmploymentTypeLabel(data.employment_type) }}
        </template>
      </Column>
      <Column field="hired_at" header="Дата приёма">
        <template #body="{ data }">
          {{ data.hired_at ? formatDate(data.hired_at) : '—' }}
        </template>
      </Column>
      <Column field="fired_at" header="Дата увольнения">
        <template #body="{ data }">
          {{ data.fired_at ? formatDate(data.fired_at) : '—' }}
        </template>
      </Column>
      <Column header="" style="width: 100px">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              text
              rounded
              size="small"
              @click="openEditDialog(data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              size="small"
              @click="removeEmployee(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <p v-else class="text-surface-500 text-sm">Нет добавленных сотрудников</p>

    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'add' ? 'Добавить сотрудника' : 'Редактировать сотрудника'"
      modal
      :style="{ width: '28rem' }"
      @hide="validationError = null"
    >
      <form @submit.prevent="saveEmployee" class="flex flex-col gap-4">
        <div class="field">
          <label for="emp_full_name" class="block text-sm font-medium mb-2">ФИО *</label>
          <InputText
            id="emp_full_name"
            v-model="employeeForm.full_name"
            placeholder="Фамилия Имя Отчество"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="emp_position" class="block text-sm font-medium mb-2">Должность</label>
          <InputText
            id="emp_position"
            v-model="employeeForm.position"
            placeholder="Введите должность"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="emp_citizenship" class="block text-sm font-medium mb-2">Гражданство</label>
          <Dropdown
            id="emp_citizenship"
            v-model="employeeForm.citizenship"
            :options="citizenshipOptions"
            option-label="label"
            option-value="value"
            placeholder="Выберите"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="emp_employment_type" class="block text-sm font-medium mb-2">Тип занятости</label>
          <Dropdown
            id="emp_employment_type"
            v-model="employeeForm.employment_type"
            :options="employmentTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="Выберите"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="emp_hired_at" class="block text-sm font-medium mb-2">Дата приёма</label>
          <DatePicker
            id="emp_hired_at"
            v-model="employeeForm.hired_at"
            date-format="yy-mm-dd"
            update-model-type="string"
            show-icon
            fluid
            placeholder="Выберите дату"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="emp_fired_at" class="block text-sm font-medium mb-2">Дата увольнения</label>
          <DatePicker
            id="emp_fired_at"
            v-model="employeeForm.fired_at"
            date-format="yy-mm-dd"
            update-model-type="string"
            show-icon
            fluid
            placeholder="Выберите дату"
            class="w-full"
          />
        </div>
        <Message v-if="validationError" severity="error">{{ validationError }}</Message>
      </form>
      <template #footer>
        <Button label="Отмена" severity="secondary" @click="dialogVisible = false" />
        <Button label="Сохранить" @click="saveEmployee" />
      </template>
    </Dialog>
  </div>
</template>
