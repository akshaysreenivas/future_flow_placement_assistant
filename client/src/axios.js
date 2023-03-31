import axios from 'axios'

// instance for user making apis
const userInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
})


// instance for admin making apis
const adminInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/admin`,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
})

// instance for HR making apis
const hrInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/hr`,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
})


// admin instance request interceptor 
adminInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("adminAuthToken");
    request.headers.Authorization = `Bearer ${token}`
    return request
})

// admin instance response interceptor 
adminInstance.interceptors.response.use(response => response.data,
    error => error.response
)


// user instance request interceptor 
userInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("userAuthToken");
    request.headers.Authorization = `Bearer ${token}`
    return request
})


// user instance response interceptor 
userInstance.interceptors.response.use(response => response.data,
    error => error.response
)


// HR instance request interceptor 
hrInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("hrAuthToken");
    request.headers.Authorization = `Bearer ${token}`
    return request
})


// HR instance response interceptor 
hrInstance.interceptors.response.use(response => response.data,
    error => error.response
)


export { adminInstance, hrInstance, userInstance }

