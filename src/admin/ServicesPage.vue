<script setup>
import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";
import { content } from "../data/store";

const confirm = useConfirm();
const toast = useToast();

const dialog = ref(false);
const editingId = ref(null);

function emptyForm() {
  return {
    id: Date.now(),
    title: { fa: "", en: "" },
    desc: { fa: "", en: "" },
  };
}

const form = ref(emptyForm());

function openNew() {
  editingId.value = null;
  form.value = emptyForm();
  dialog.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  form.value = JSON.parse(JSON.stringify(row));
  dialog.value = true;
}

function save() {
  if (!form.value.title.fa.trim() || !form.value.title.en.trim()) {
    toast.add({
      severity: "warn",
      summary: "عنوان فارسی و انگلیسی الزامی است",
      life: 3000,
    });
    return;
  }
  const i = content.services.findIndex((s) => s.id === editingId.value);
  if (i === -1) content.services.push(form.value);
  else content.services.splice(i, 1, form.value);

  dialog.value = false;
  toast.add({
    severity: "success",
    summary: "ثبت شد",
    detail: "برای انتشار، «ذخیره و انتشار» را بزنید",
    life: 2500,
  });
}

function remove(row) {
  confirm.require({
    header: "حذف خدمت",
    message: `«${row.title.fa}» حذف شود؟`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "انصراف", severity: "secondary", outlined: true },
    acceptProps: { label: "حذف", severity: "danger" },
    accept: () => {
      const i = content.services.findIndex((s) => s.id === row.id);
      content.services.splice(i, 1);
    },
  });
}

function onReorder(e) {
  content.services.splice(0, content.services.length, ...e.value);
}
</script>

<template>
  <h1 class="mb-6 text-2xl font-bold">خدمات</h1>

  <Toolbar class="mb-4">
    <template #start>
      <Button label="خدمت جدید" icon="pi pi-plus" @click="openNew" />
    </template>
  </Toolbar>

  <DataTable
    :value="content.services"
    data-key="id"
    size="small"
    @row-reorder="onReorder"
  >
    <template #empty>هنوز خدمتی ثبت نشده است.</template>

    <Column row-reorder style="width: 3rem" />
    <Column header="عنوان (فارسی)">
      <template #body="{ data }">{{ data.title.fa }}</template>
    </Column>
    <Column header="Title (English)">
      <template #body="{ data }">
        <span dir="ltr">{{ data.title.en }}</span>
      </template>
    </Column>
    <Column header="عملیات" style="width: 8rem">
      <template #body="{ data }">
        <div class="flex gap-1">
          <Button
            icon="pi pi-pencil"
            severity="secondary"
            text
            rounded
            aria-label="ویرایش"
            @click="openEdit(data)"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            aria-label="حذف"
            @click="remove(data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>

  <Dialog
    v-model:visible="dialog"
    modal
    :header="editingId ? 'ویرایش خدمت' : 'خدمت جدید'"
    :style="{ width: '40rem' }"
    :breakpoints="{ '768px': '95vw' }"
  >
    <form class="flex flex-col gap-6 pt-2" @submit.prevent="save">
      <FloatLabel variant="on">
        <InputText id="t-fa" v-model="form.title.fa" dir="rtl" fluid />
        <label for="t-fa">عنوان (فارسی)</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="t-en" v-model="form.title.en" dir="ltr" fluid />
        <label for="t-en">Title (English)</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Textarea
          id="d-fa"
          v-model="form.desc.fa"
          dir="rtl"
          rows="3"
          auto-resize
          fluid
        />
        <label for="d-fa">توضیح (فارسی)</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Textarea
          id="d-en"
          v-model="form.desc.en"
          dir="ltr"
          rows="3"
          auto-resize
          fluid
        />
        <label for="d-en">Description (English)</label>
      </FloatLabel>

      <div class="flex justify-end gap-2">
        <Button
          label="انصراف"
          severity="secondary"
          outlined
          @click="dialog = false"
        />
        <Button type="submit" label="ثبت" icon="pi pi-check" />
      </div>
    </form>
  </Dialog>
</template>
