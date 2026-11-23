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
import FloatLabel from "primevue/floatlabel";
import FileUpload from "primevue/fileupload";
import { content, uploadImage } from "../data/store";
import { resizeToDataUrl } from "../lib/image";
import { saveNow } from "./useSaver";

const confirm = useConfirm();
const toast = useToast();

const dialog = ref(false);
const editingId = ref(null);
const uploading = ref(false);

function emptyForm() {
  return {
    id: Date.now(),
    title: { fa: "", en: "" },
    issuer: { fa: "", en: "" },
    link: "",
    image: "",
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

async function save() {
  if (!form.value.title.fa.trim() || !form.value.title.en.trim()) {
    const ok = await saveNow();
    toast.add(
      ok
        ? { severity: "success", summary: "ثبت و منتشر شد", life: 2500 }
        : {
            severity: "error",
            summary: "ذخیره نشد",
            detail: "دوباره وارد شوید و تلاش کنید",
            life: 4000,
          },
    );
    return;
  }
  const i = content.certificates.findIndex((c) => c.id === editingId.value);
  if (i === -1) content.certificates.push(form.value);
  else content.certificates.splice(i, 1, form.value);

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
    header: "حذف گواهی‌نامه",
    message: `«${row.title.fa}» حذف شود؟`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "انصراف", severity: "secondary", outlined: true },
    acceptProps: { label: "حذف", severity: "danger" },
    accept: () => {
      const i = content.certificates.findIndex((c) => c.id === row.id);
      content.certificates.splice(i, 1);
    },
  });
}

function onReorder(e) {
  content.certificates.splice(0, content.certificates.length, ...e.value);
}

async function onUpload(e) {
  uploading.value = true;
  try {
    const dataUrl = await resizeToDataUrl(e.files[0]);
    try {
      form.value.image = await uploadImage(dataUrl);
    } catch {
      if (!import.meta.env.DEV) throw new Error("upload failed");
      form.value.image = dataUrl;
      toast.add({
        severity: "info",
        summary: "حالت محلی",
        detail: "تصویر فقط موقتاً در حافظه است",
        life: 3000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "آپلود تصویر ناموفق بود",
      life: 3500,
    });
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <h1 class="mb-6 text-2xl font-bold">گواهی‌نامه‌ها</h1>

  <Toolbar class="mb-4">
    <template #start>
      <Button label="گواهی‌نامه جدید" icon="pi pi-plus" @click="openNew" />
    </template>
  </Toolbar>

  <DataTable
    :value="content.certificates"
    data-key="id"
    size="small"
    @row-reorder="onReorder"
  >
    <template #empty>هنوز گواهی‌نامه‌ای ثبت نشده است.</template>

    <Column row-reorder style="width: 3rem" />
    <Column header="تصویر" style="width: 6rem">
      <template #body="{ data }">
        <img
          v-if="data.image"
          :src="data.image"
          alt=""
          class="h-10 w-16 rounded object-cover"
        />
        <i v-else class="pi pi-image text-xl opacity-40"></i>
      </template>
    </Column>
    <Column header="عنوان">
      <template #body="{ data }">{{ data.title.fa }}</template>
    </Column>
    <Column header="صادرکننده">
      <template #body="{ data }">{{ data.issuer.fa }}</template>
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
    :header="editingId ? 'ویرایش گواهی‌نامه' : 'گواهی‌نامه جدید'"
    :style="{ width: '40rem' }"
    :breakpoints="{ '768px': '95vw' }"
  >
    <form class="flex flex-col gap-6 pt-2" @submit.prevent="save">
      <FloatLabel variant="on">
        <InputText id="c-t-fa" v-model="form.title.fa" dir="rtl" fluid />
        <label for="c-t-fa">عنوان (فارسی)</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText id="c-t-en" v-model="form.title.en" dir="ltr" fluid />
        <label for="c-t-en">Title (English)</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText id="c-i-fa" v-model="form.issuer.fa" dir="rtl" fluid />
        <label for="c-i-fa">صادرکننده (فارسی)</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText id="c-i-en" v-model="form.issuer.en" dir="ltr" fluid />
        <label for="c-i-en">Issuer (English)</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText id="c-link" v-model="form.link" dir="ltr" fluid />
        <label for="c-link">لینک گواهی (اختیاری)</label>
      </FloatLabel>

      <div class="flex flex-wrap items-center gap-4">
        <img
          v-if="form.image"
          :src="form.image"
          alt=""
          class="h-20 w-32 rounded object-cover"
        />
        <FileUpload
          mode="basic"
          accept="image/*"
          custom-upload
          auto
          choose-label="انتخاب تصویر"
          :disabled="uploading"
          @uploader="onUpload"
        />
        <Button
          v-if="form.image"
          label="حذف تصویر"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="form.image = ''"
        />
      </div>

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
