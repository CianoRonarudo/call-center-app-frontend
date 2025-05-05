import axios from "axios"
const api = axios.create({
    baseURL: 'https://agriconnect-bc17856a61b8.herokuapp.com'
})
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `bearer ${token}`
    }
    return config
})
export default api
