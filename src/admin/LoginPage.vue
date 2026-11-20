<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const password = ref('')
const loading = ref(false)
const error = ref(false)

async function login() {
  loading.value = true
  error.value = false
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { Authorization: `Bearer ${password.value}` },
    })
    if (!res.ok) throw new Error('unauthorized')
    sessionStorage.setItem('token', password.value)
    router.push('/panel')
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-sm">
      <template #title>ورود به پنل مدیریت</template>
      <template #subtitle>رمز عبور را وارد کنید</template>
      <template #content>
        <form class="flex flex-col gap-5" @submit.prevent="login">
          <FloatLabel variant="on">
            <Password
              v-model="password"
              input-id="pw"
              :feedback="false"
              toggle-mask
              fluid
            />
            <label for="pw">رمز عبور</label>
          </FloatLabel>

          <Message v-if="error" severity="error" size="small">
            رمز اشتباه است
          </Message>

          <Button
            type="submit"
            label="ورود"
            icon="pi pi-sign-in"
            :loading="loading"
            fluid
          />
        </form>
      </template>
    </Card>
  </div>
</template>