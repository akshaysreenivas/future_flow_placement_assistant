import { userInstance } from "../axios";

// login service  
export function userLogin(email, password) {
    //   calling api
    return userInstance.post("/login", {
        email,
        password,
    });
}


// fetch all jobs  
export function getAllJobs(page,search,filter) {
    const url=`?page=${page}&department=${filter}&search=${search}`
    return userInstance.get(`/getJobs/${url}`);
}

// fetch single job details 
export function getJob(id) {
    return userInstance.get(`/getJob/${id}`);
}

// apply for the job 
export function applyJob(id) {
    return userInstance.post(`/applyforJob/${id}`);
}

// cancel the job application
export function cancelJobApplication(id) {
    return userInstance.post(`/cancelJobapplication/${id}`);
}