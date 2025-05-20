
<template>
  <VRow>
    
    <VCol cols="12">
      <VCard title="Edit Products">
        <VCardText>
          <VForm>
            <VRow>
              <VCol md="6" cols="12">
                <VTextField placeholder="Product Name" label="Product Name"></VTextField>
              </VCol>
              <VCol cols="12 gap-4">
                <VBtn type="submit">
                  Submit
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
    
  </VRow>
  <VSnackbar v-model="notificationStore.show" :color="notificationStore.color">
    {{ notificationStore.message }}
  </VSnackbar>
</template>

<script setup>
  import { useNotificationStore } from '@/stores/notification.store';
  const notificationStore = useNotificationStore()
</script>
