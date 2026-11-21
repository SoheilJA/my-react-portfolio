<script setup>
import { useConfirm } from "primevue/useconfirm";
import Panel from "primevue/panel";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import AutoComplete from "primevue/autocomplete";
import FloatLabel from "primevue/floatlabel";
import { content } from "../data/store";

const confirm = useConfirm();

function add() {
  content.skills.push({ id: Date.now(), title: { fa: "", en: "" }, items: [] });
}

function remove(i) {
  confirm.require({
    header: "حذف گروه",
    message: "این گروه مهارت حذف شود؟",
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "انصراف", severity: "secondary", outlined: true },
    acceptProps: { label: "حذف", severity: "danger" },
    accept: () => content.skills.splice(i, 1),
  });
}
</script>

<template>
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">مهارت‌ها</h1>
    <Button label="گروه جدید" icon="pi pi-plus" @click="add" />
  </div>

  <div class="flex flex-col gap-4">
    <Panel
      v-for="(g, i) in content.skills"
      :key="g.id"
      :header="g.title.fa || 'گروه جدید'"
      toggleable
    >
      <template #icons>
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          aria-label="حذف"
          @click="remove(i)"
        />
      </template>

      <div class="flex flex-col gap-6 pt-2">
        <div class="grid gap-6 md:grid-cols-2">
          <FloatLabel variant="on">
            <InputText
              :id="`s-fa-${g.id}`"
              v-model="g.title.fa"
              dir="rtl"
              fluid
            />
            <label :for="`s-fa-${g.id}`">عنوان گروه (فارسی)</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText
              :id="`s-en-${g.id}`"
              v-model="g.title.en"
              dir="ltr"
              fluid
            />
            <label :for="`s-en-${g.id}`">Group title (English)</label>
          </FloatLabel>
        </div>

        <div>
          <label class="mb-2 block text-sm opacity-70">
            مهارت‌ها (بعد از هر مورد Enter بزنید)
          </label>
          <AutoComplete
            v-model="g.items"
            multiple
            fluid
            :typeahead="false"
            dir="ltr"
          />
        </div>
      </div>
    </Panel>
  </div>
</template>
