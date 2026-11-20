<script setup>
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { FilterMatchMode } from '@primevue/core/api'
import { content } from '../data/store'

const rows = computed(() =>
  Object.entries(content.texts).map(([key, value]) => ({ key, value }))
)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
</script>

<template>
  <h1 class="mb-6 text-2xl font-bold">متن‌ها</h1>

  <DataTable
    v-model:filters="filters"
    :value="rows"
    :global-filter-fields="['key', 'value.fa', 'value.en']"
    data-key="key"
    paginator
    :rows="10"
    :rows-per-page-options="[10, 20, 50]"
    size="small"
  >
    <template #header>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.global.value" placeholder="جستجو در متن‌ها..." />
      </IconField>
    </template>

    <template #empty>موردی پیدا نشد.</template>

    <Column field="key" header="کلید" style="min-width: 10rem">
      <template #body="{ data }">
        <code dir="ltr" class="text-sm opacity-70">{{ data.key }}</code>
      </template>
    </Column>

    <Column header="فارسی" style="min-width: 18rem">
      <template #body="{ data }">
        <Textarea v-model="data.value.fa" dir="rtl" auto-resize rows="1" fluid />
      </template>
    </Column>

    <Column header="English" style="min-width: 18rem">
      <template #body="{ data }">
        <Textarea v-model="data.value.en" dir="ltr" auto-resize rows="1" fluid />
      </template>
    </Column>
  </DataTable>
</template>