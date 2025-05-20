<template>
  <!-- eslint-disable vue/no-v-html -->
  <VSnackbar v-model="notificationStore.show" :color="notificationStore.color">
    {{ notificationStore.message }}
  </VSnackbar>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <RouterLink
          to="/"
          class="d-flex align-center gap-3"
        >
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="d-flex"
            v-html="logo"
          />
          <h2 class="font-weight-medium text-2xl text-uppercase">
            Materio
          </h2>
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">
          Welcome to Materio! 👋🏻
        </h4>
        <p class="mb-0">
          Reset your password here. 
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="handleResetPassword">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                label="Email"
                type="email"
                v-model="form.email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <!-- login button -->
              <VBtn
                block
                type="submit"
                :loading="authStore.isLoading"
              >
                Send
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
  
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useTheme } from 'vuetify'

const authStore = useAuthStore()

const notificationStore = useNotificationStore()

const form = ref({
  email: '',
})

const handleResetPassword = async () => {
  try {
    await authStore.requestPasswordReset(form.value.email)
  } catch (error) {
    console.error('Error during login', error)
  }
}

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
