import api from "@/utils/api";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useNotificationStore } from "./notification.store";

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const notificationStore = useNotificationStore()
    const token = ref(localStorage.getItem('access_token') || null)
    const user = ref(null)
    const isLoading = ref(false)
    const isAuthenticated = computed(() => !!token.value)


    /**
     * @function login
     * @description Logs in the user
     * @param {Object} credentials - The user credentials
     * @param {string} credentials.email - The user email
     * @param {string} credentials.password - The user password
     * @returns {Promise<Object>} The user data
     */
    const login = async (credentials) => {
        isLoading.value = true
        try {
            const response = await api.post('/auth/login', {"email": credentials.email, "password" : credentials.password})

            token.value = response.data.access_token
            user.value = response.data.user

            localStorage.setItem('access_token', token.value)
            localStorage.setItem('user', JSON.stringify(user.value))

            notificationStore.trigger('Login successful', 'success')
            await router.push('/')
            return response.data
            
        } catch (error) {
            let message = error.response.data.message
            if (error.response) {
                message = error.response.data.message
            } else if (error.request) {
                message = error.request
            } else {
                message = error.message
            }
            notificationStore.trigger(message, 'error')
            throw error
        } finally {
            isLoading.value = false
        }
    }

    /**
     * @function logout
     * @description Logs out the user
     * @returns {Promise<void>} The logout result
     */
    const logout = async () => {
        try {
            await api.post('/auth/logout', {}, {
                headers: {
                    Authorization: `bearer ${token.value}`
                }
            })
        }
        catch (error) {
            let message = error.response.data.message
            if (error.response) {
                message = error.response.data.message
            } else if (error.request) {
                message = error.request
            } else {
                message = error.message
            }
            notificationStore.trigger(message, 'error')
            throw error
        } finally {
            token.value = null
            user.value = null

            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
            
            sessionStorage.clear()

            notificationStore.trigger('Logout successful', 'success')
            await router.push('/login')
        }
        
    }

    const updateUserProfile = async (userId, userData) => {
        isLoading.value = true
        try {
            const response = await api.put(`/users/${userId}`, {
                FirstName: userData.FirstName,
                LastName: userData.LastName,
                email: userData.email,
                Phone: userData.Phone,
                Address: userData.Address,
            }, {
                headers: {
                    Authorization: `bearer ${token.value}`,
                    'Content-Type': 'application/json'
                }
            })

            user.value = response.data
            notificationStore.trigger('Profile updated successfully', 'success')

            return response.data
        } catch (error) {
            let message = error.response.data.message
            if (error.response) {
                message = error.response.data.message
            } else if (error.request) {
                message = error.request
            } else {
                message = error.message
            }
            notificationStore.trigger(message, 'error')
            throw error
        } finally {
            isLoading.value = false
        }
        
    }

    return {
        token,
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUserProfile,
    }
    
})
