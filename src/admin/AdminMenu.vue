<script setup>
import Menu from "primevue/menu";

const emit = defineEmits(["navigate"]);

const items = [
  { label: "داشبورد", icon: "pi pi-home", route: "/admin" },
  { label: "متن‌ها", icon: "pi pi-align-right", route: "/admin/texts" },
  { label: "خدمات", icon: "pi pi-briefcase", route: "/admin/services" },
  { label: "نمونه‌کارها", icon: "pi pi-images", route: "/admin/projects" },
  { label: "تکنولوژی‌ها", icon: "pi pi-list", route: "/admin/technologies" },
  { label: "مهارت‌ها", icon: "pi pi-bolt", route: "/admin/skills" },
  {
    label: "گواهی‌نامه‌ها",
    icon: "pi pi-verified",
    route: "/admin/certificates",
  },
  { label: "تماس", icon: "pi pi-phone", route: "/admin/contact" },
];
</script>

<template>
  <Menu :model="items" class="w-full border-0! bg-transparent!">
    <template #item="{ item, props }">
      <router-link
        v-slot="{ href, navigate, isExactActive }"
        :to="item.route"
        custom
      >
        <a
          :href="href"
          v-bind="props.action"
          :style="
            isExactActive
              ? 'color: var(--p-primary-color); font-weight: 700'
              : ''
          "
          @click="
            navigate($event);
            emit('navigate');
          "
        >
          <span :class="item.icon"></span>
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>
  </Menu>
</template>
