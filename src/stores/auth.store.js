import api from "@/utils/api";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useNotificationStore } from "./notification.store";

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const notificationStore = useNotificationStore()
    const token = ref(localStorage.getItem('access_token') || null)
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const isLoading = ref(false)
    const isAuthenticated = computed(() => !!token.value)

    const initialize = () => {
        const storedToken = localStorage.getItem('access_token')
        const storedUser = localStorage.getItem('user')

        if (storedToken) {
            token.value = storedToken
            user.value = storedUser ? JSON.parse(storedUser) : null
        }
    }

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

    /**
     * @function updateUserProfile
     * @description Updates the logged in user's profile
     * @param {FormData} userData The user data to update
     * @returns {Promise<Object>} The updated user
     */
    const updateUserProfile = async (userData) => {
        try {
            isLoading.value = true
            const formData = new FormData()

            if (userData.get('id')) formData.append('id', userData.get('id'))
            if (userData.get('FirstName')) formData.append('FirstName', userData.get('FirstName'))
            if (userData.get('LastName')) formData.append('LastName', userData.get('LastName'))
            if (userData.get('email')) formData.append('email', userData.get('email'))
            if (userData.get('Phone')) formData.append('Phone', userData.get('Phone'))
            if (userData.get('Address')) formData.append('Address', userData.get('Address'))
            
            if (userData.get('Photo')) {
                formData.append('Photo', userData.get('Photo'))
            }
            const config = {
                headers: {
                    'Authorization': `bearer ${token.value}`,
                    'Content-Type': 'multipart/form-data'
                }
            }

            const response = await api.put(`/users/${user.value.id}`, formData, config)

            user.value = response.data
            localStorage.setItem('user', JSON.stringify(response.data))

            notificationStore.trigger('Login successful', 'success')
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

    const checkAuth = async () => {
        if (!token.value) return

        if (!user.value?.id) {
            console.warn('No user data found in auth store')
            return
        }

        try {
            isLoading.value = true
            const response = await api.get(`/users/${user.value.id}`, {
                headers: {
                    Authorization: `bearer ${token.value}`
                }
            })

            user.value = response.data
            localStorage.setItem('user', JSON.stringify(user.value))
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

    initialize()

    return {
        token,
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUserProfile,
        checkAuth,
    }
    
})
