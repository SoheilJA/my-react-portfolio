<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import Tag from "primevue/tag";
import AdminMenu from "./AdminMenu.vue";
import { content } from "../data/store";
import { saveState, scheduleSave, saveNow } from "./useSaver";

const router = useRouter();
const toast = useToast();
const drawer = ref(false);

watch(content, () => scheduleSave(), { deep: true });

watch(saveState, (s) => {
  if (s === "error") {
    toast.add({
      severity: "error",
      summary: "ذخیره نشد",
      detail: "دوباره وارد شوید و تلاش کنید",
      life: 4000,
    });
  }
});

const labels = {
  dirty: { text: "تغییرات ذخیره‌نشده", severity: "warn" },
  saving: { text: "در حال ذخیره...", severity: "info" },
  saved: { text: "ذخیره شد", severity: "success" },
  error: { text: "ذخیره نشد", severity: "danger" },
};

async function save() {
  const ok = await saveNow(true);
  if (ok) toast.add({ severity: "success", summary: "منتشر شد", life: 2000 });
}

function logout() {
  sessionStorage.removeItem("token");
  router.push("/admin/login");
}

function warnLeave(e) {
  if (["dirty", "saving"].includes(saveState.value)) {
    e.preventDefault();
    e.returnValue = "";
  }
}
onMounted(() => window.addEventListener("beforeunload", warnLeave));
onUnmounted(() => window.removeEventListener("beforeunload", warnLeave));
</script>

<template>
  <div class="flex min-h-screen">
    <aside
      class="hidden w-64 shrink-0 border-e p-4 lg:block"
      style="border-color: var(--p-content-border-color)"
    >
      <div class="px-3 py-4 text-xl font-bold">پنل مدیریت</div>
      <AdminMenu />
    </aside>

    <Drawer v-model:visible="drawer" header="پنل مدیریت" position="right">
      <AdminMenu @navigate="drawer = false" />
    </Drawer>

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3"
        style="
          background: var(--p-content-background);
          border-color: var(--p-content-border-color);
        "
      >
        <Button
          class="lg:hidden"
          icon="pi pi-bars"
          severity="secondary"
          text
          rounded
          aria-label="منو"
          @click="drawer = true"
        />
        <div class="ms-auto flex items-center gap-2">
          <Button
            as="a"
            href="/fa"
            target="_blank"
            label="مشاهده سایت"
            icon="pi pi-external-link"
            severity="secondary"
            text
          />
          <Tag
            v-if="labels[saveState]"
            :value="labels[saveState].text"
            :severity="labels[saveState].severity"
          />
          <Button
            label="ذخیره و انتشار"
            icon="pi pi-save"
            :loading="saveState === 'saving'"
            @click="save"
          />
          <Button
            icon="pi pi-sign-out"
            severity="secondary"
            text
            rounded
            aria-label="خروج"
            @click="logout"
          />
        </div>
      </header>

      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
