<script setup>
import { useAuthStore } from '@/stores/auth.store'
import TypographyHeadlines from '@/views/user-interface/typography/TypographyHeadlines.vue'
import TypographyTexts from '@/views/user-interface/typography/TypographyTexts.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <TypographyHeadlines />
    </VCol>

    <VCol cols="12">
      <TypographyTexts />
    </VCol>
  </VRow>
</template>
