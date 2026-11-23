<script setup>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { content } from "../data/store";

function add() {
  content.technologies.push("");
}

function remove(i) {
  content.technologies.splice(i, 1);
}

function move(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= content.technologies.length) return;
  const arr = content.technologies;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
</script>

<template>
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">تکنولوژی‌ها</h1>
    <Button label="تکنولوژی جدید" icon="pi pi-plus" @click="add" />
  </div>

  <p class="mb-5 text-sm leading-6 opacity-70">
    تکنولوژی‌ها را به انگلیسی بنویسید. سپس در ویرایش هر نمونه‌کار، موارد دلخواه
    را انتخاب کنید؛ نمایش آن‌ها برای هر پروژه به همان ترتیبی است که انتخاب کرده‌اید.
  </p>

  <div
    v-if="!content.technologies.length"
    class="rounded border border-dashed p-6 text-center opacity-60"
    style="border-color: var(--p-content-border-color)"
  >
    هنوز تکنولوژی‌ای اضافه نشده است.
  </div>

  <div class="flex flex-col gap-3">
    <div
      v-for="(tech, i) in content.technologies"
      :key="i"
      class="flex items-center gap-2"
    >
      <span class="w-8 text-center font-mono text-sm opacity-50">{{
        i + 1
      }}</span>
      <InputText
        v-model="content.technologies[i]"
        dir="ltr"
        fluid
        placeholder="e.g. Django"
      />
      <Button
        icon="pi pi-arrow-up"
        severity="secondary"
        text
        rounded
        :disabled="i === 0"
        aria-label="بالا"
        @click="move(i, -1)"
      />
      <Button
        icon="pi pi-arrow-down"
        severity="secondary"
        text
        rounded
        :disabled="i === content.technologies.length - 1"
        aria-label="پایین"
        @click="move(i, 1)"
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        text
        rounded
        aria-label="حذف"
        @click="remove(i)"
      />
    </div>
  </div>
</template>