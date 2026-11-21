<script setup>
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import FloatLabel from "primevue/floatlabel";
import { content } from "../data/store";

function add() {
  content.contact.socials.push({ id: Date.now(), name: "", url: "" });
}

function remove(i) {
  content.contact.socials.splice(i, 1);
}
</script>

<template>
  <h1 class="mb-6 text-2xl font-bold">اطلاعات تماس</h1>

  <div class="grid gap-6 xl:grid-cols-2">
    <Card>
      <template #title>راه‌های ارتباطی</template>
      <template #content>
        <div class="flex flex-col gap-6 pt-2">
          <InputGroup>
            <InputGroupAddon><i class="pi pi-envelope"></i></InputGroupAddon>
            <FloatLabel variant="on">
              <InputText
                id="email"
                v-model="content.contact.email"
                dir="ltr"
                fluid
              />
              <label for="email">ایمیل</label>
            </FloatLabel>
          </InputGroup>

          <InputGroup>
            <InputGroupAddon><i class="pi pi-phone"></i></InputGroupAddon>
            <FloatLabel variant="on">
              <InputText
                id="phone"
                v-model="content.contact.phone"
                dir="ltr"
                fluid
              />
              <label for="phone">تلفن</label>
            </FloatLabel>
          </InputGroup>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>شبکه‌های اجتماعی</template>
      <template #subtitle
        >شبکه‌ای که لینکش خالی باشد در سایت نمایش داده نمی‌شود</template
      >
      <template #content>
        <div class="flex flex-col gap-3">
          <InputGroup v-for="(s, i) in content.contact.socials" :key="s.id">
            <InputText
              v-model="s.name"
              dir="ltr"
              placeholder="GitHub"
              style="max-width: 9rem"
            />
            <InputText v-model="s.url" dir="ltr" placeholder="https://..." />
            <Button
              icon="pi pi-trash"
              severity="danger"
              aria-label="حذف"
              @click="remove(i)"
            />
          </InputGroup>

          <Button
            class="self-start"
            label="شبکه جدید"
            icon="pi pi-plus"
            severity="secondary"
            outlined
            @click="add"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
