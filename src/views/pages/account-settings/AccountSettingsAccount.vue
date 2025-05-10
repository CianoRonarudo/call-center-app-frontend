<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="avatarPreview || (authStore.user?.Photo ? authStore.user.Photo : avatar1)"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="ri-upload-cloud-line"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="error"
                variant="outlined"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="ri-refresh-line"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6" @submit.prevent="handleUpdateUser">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="userForm.FirstName"
                  placeholder="John"
                  label="First Name"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="userForm.LastName"
                  placeholder="Doe"
                  label="Last Name"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="userForm.email"
                  label="E-mail"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  disabled="disabled"
                />
              </VCol>

             

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="userForm.Phone"
                  label="Phone Number"
                  placeholder="+1 (917) 543-9876"
                />
              </VCol>

              <!-- 👉 Address -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="userForm.Address"
                  label="Address"
                  placeholder="123 Main St, New York, NY 10001"
                />
              </VCol>
              
              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn type="submit" :loading="authStore.isLoading">Save changes</VBtn>

                <VBtn
                  color="secondary"
                  variant="outlined"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <VCard title="Deactivate Account">
        <VCardText>
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              label="I confirm my account deactivation"
            />
          </div>

          <VBtn
            :disabled="!isAccountDeactivated"
            color="error"
            class="mt-3"
          >
            Deactivate Account
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VSnackbar v-model="notificationStore.show" :color="notificationStore.color">
    {{ notificationStore.message }}
  </VSnackbar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import avatar1 from '@images/avatars/avatar-1.png'
import { onMounted, ref } from 'vue'

const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const refInputEl = ref()
const avatarPreview = ref(null)
const isAccountDeactivated = ref(false)


const userForm = ref({
  id : '',
  FirstName : '',
  LastName : '',
  email : '',
  Phone : '',
  Address: '',
  Photo: null,
})

onMounted(() => {
  if (authStore.user) {
    userForm.value = {
      id: authStore.user.id,
      FirstName: authStore.user.FirstName || '',
      LastName: authStore.user.LastName || '',
      email: authStore.user.email || '',
      Phone: authStore.user.Phone || '',
      Address: authStore.user.Address || '',
      Photo: authStore.user.Photo || null,
    }
  }
})

const handleUpdateUser = async () => {
  try {
    const formData = new FormData()
    formData.append('id', userForm.value.id)
    formData.append('FirstName', userForm.value.FirstName)
    formData.append('LastName', userForm.value.LastName)
    formData.append('email', userForm.value.email)
    formData.append('Phone', userForm.value.Phone)
    formData.append('Address', userForm.value.Address)

    if (userForm.value.Photo) {
      formData.append('Photo', userForm.value.Photo)
    }

    await authStore.updateUserProfile(formData)

    avatarPreview.value = null
  } catch (error) {
    console.error('Error during login', error)
  }
  
}



const resetForm = () => {
  if (authStore.user) {
    userForm.value = {
      id: authStore.user.id,
      FirstName: authStore.user.FirstName || '',
      LastName: authStore.user.LastName || '',
      email: authStore.user.email || '',
      Phone: authStore.user.Phone || '',
      Address: authStore.user.Address || '',
      Photo: authStore.user.Photo || null,
    }
  }
  resetAvatar()
}

const changeAvatar = (event) => {
  const file = event.target.files[0]

  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  if(!validTypes.includes(file.type)) {
    notificationStore.trigger('Please select a valid image file', 'error')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    notificationStore.trigger('Please select a file less than 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
  userForm.value.Photo = file
}


// reset avatar image
const resetAvatar = () => {
  avatarPreview.value = null
  userForm.value.Photo = null
  refInputEl.value.value = ''
}


</script>
