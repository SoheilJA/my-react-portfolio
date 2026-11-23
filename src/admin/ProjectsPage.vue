<script setup>
import { ref, computed } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import AutoComplete from "primevue/autocomplete";
import FloatLabel from "primevue/floatlabel";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import ToggleSwitch from "primevue/toggleswitch";
import Tag from "primevue/tag";
import FileUpload from "primevue/fileupload";
import { content, uploadImage } from "../data/store";
import { resizeToDataUrl } from "../lib/image";
import { saveNow } from "./useSaver";

const confirm = useConfirm();
const toast = useToast();

const filter = ref("all");
const filterOptions = [
  { label: "همه", value: "all" },
  { label: "برنامه‌نویسی", value: "code" },
  { label: "وردپرس", value: "wordpress" },
];
const categoryOptions = filterOptions.slice(1);

const list = computed(() =>
  content.projects.filter(
    (p) => filter.value === "all" || p.category === filter.value,
  ),
);

const dialog = ref(false);
const editingId = ref(null);
const uploading = ref(false);

function emptyForm() {
  return {
    id: Date.now(),
    category: filter.value === "wordpress" ? "wordpress" : "code",
    featured: false,
    image: "",
    link: "",
    title: { fa: "", en: "" },
    desc: { fa: "", en: "" },
    tech: [],
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
  const i = content.projects.findIndex((p) => p.id === editingId.value);
  if (i === -1) content.projects.unshift(form.value);
  else content.projects.splice(i, 1, form.value);

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
    header: "حذف نمونه‌کار",
    message: `«${row.title.fa}» حذف شود؟`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "انصراف", severity: "secondary", outlined: true },
    acceptProps: { label: "حذف", severity: "danger" },
    accept: () => {
      const i = content.projects.findIndex((p) => p.id === row.id);
      content.projects.splice(i, 1);
    },
  });
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
  <h1 class="mb-6 text-2xl font-bold">نمونه‌کارها</h1>

  <Toolbar class="mb-4">
    <template #start>
      <Button label="نمونه‌کار جدید" icon="pi pi-plus" @click="openNew" />
    </template>
    <template #end>
      <SelectButton
        v-model="filter"
        :options="filterOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
      />
    </template>
  </Toolbar>

  <DataTable :value="list" data-key="id" size="small" paginator :rows="10">
    <template #empty>نمونه‌کاری پیدا نشد.</template>

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

    <Column header="دسته" style="width: 9rem">
      <template #body="{ data }">
        <Tag
          :value="data.category === 'code' ? 'برنامه‌نویسی' : 'وردپرس'"
          :severity="data.category === 'code' ? 'info' : 'secondary'"
        />
      </template>
    </Column>

    <Column header="نمایش در صفحه اصلی" style="width: 10rem">
      <template #body="{ data }">
        <ToggleSwitch v-model="data.featured" />
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
    :header="editingId ? 'ویرایش نمونه‌کار' : 'نمونه‌کار جدید'"
    :style="{ width: '44rem' }"
    :breakpoints="{ '768px': '95vw' }"
  >
    <form class="flex flex-col gap-6 pt-2" @submit.prevent="save">
      <div class="flex flex-wrap items-center gap-6">
        <Select
          v-model="form.category"
          :options="categoryOptions"
          option-label="label"
          option-value="value"
          class="w-48"
        />
        <label class="flex items-center gap-3">
          <ToggleSwitch v-model="form.featured" />
          نمایش در صفحه اصلی
        </label>
      </div>

      <FloatLabel variant="on">
        <InputText id="p-t-fa" v-model="form.title.fa" dir="rtl" fluid />
        <label for="p-t-fa">عنوان (فارسی)</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="p-t-en" v-model="form.title.en" dir="ltr" fluid />
        <label for="p-t-en">Title (English)</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Textarea
          id="p-d-fa"
          v-model="form.desc.fa"
          dir="rtl"
          rows="3"
          auto-resize
          fluid
        />
        <label for="p-d-fa">توضیح (فارسی)</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <Textarea
          id="p-d-en"
          v-model="form.desc.en"
          dir="ltr"
          rows="3"
          auto-resize
          fluid
        />
        <label for="p-d-en">Description (English)</label>
      </FloatLabel>

      <div>
        <label class="mb-2 block text-sm opacity-70"
          >تکنولوژی‌ها (بعد از هر مورد Enter بزنید)</label
        >
        <AutoComplete
          v-model="form.tech"
          multiple
          fluid
          :typeahead="false"
          dir="ltr"
        />
      </div>

      <FloatLabel variant="on">
        <InputText id="p-link" v-model="form.link" dir="ltr" fluid />
        <label for="p-link">لینک پروژه (اختیاری)</label>
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
