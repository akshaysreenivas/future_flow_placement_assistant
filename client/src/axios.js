import axios from 'axios'

// instance for user making apis
const userInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    
})


// instance for admin making apis
const adminInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/admin`,
})

// instance for HR making apis
const hrInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/hr`,
})


// admin instance request interceptor 
adminInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("adminAuthToken");
    request.headers.Authorization = `Bearer ${token}`
    return request
})

// admin instance response interceptor 
adminInstance.interceptors.response.use(response => response.data,
    error => error.response.data
)


// user instance request interceptor 
userInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("userAuthToken");
    request.headers.Authorization = `Bearer ${token}`
    return request
})


// user instance response interceptor 
userInstance.interceptors.response.use(response => response.data,
    error => error.response.data
)



// HR instance request interceptor 
hrInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("hrAuthToken");
    request.headers.Authorization = `Bearer ${token}`
    return request
})



// HR instance response interceptor 
hrInstance.interceptors.response.use(response => response.data,
    error => error.response.data
)


export { adminInstance, hrInstance, userInstance }

