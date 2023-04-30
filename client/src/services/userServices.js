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
// apply for the job 
export function appliedJobs() {
    return userInstance.get(`/appliedJobs`);
}

// cancel the job application
export function cancelJobApplication(id) {
    return userInstance.post(`/cancelJobapplication/${id}`);
}

// getting user details for profile   
export function getUserDetails() {
    return userInstance.get(`/getUserDetails`);
}

// change password  
export function changePassword(password) {
    return userInstance.put(`/changePassword`,{password});
}

// Uploading Profile Photo  
export function uploadProfilePhoto(profile,oldProfileImg) {
    return userInstance.post(`/addProfilePhoto`,{image:profile,oldProfileImg:oldProfileImg},{headers: {
        "Content-Type": "multipart/form-data"
    }});
}

// Uploading cover Photo  
export function uploadCoverPhoto(cover,oldCoverImg) {
    return userInstance.post(`/addCoverPhoto`,{image:cover,oldCoverImg:oldCoverImg},{headers: {
        "Content-Type": "multipart/form-data"
    }});
}

// Uploading attachment Photo  
export function uploadAttachments(state) {
    return userInstance.post(`/addAttachments`,state,{headers: {
        "Content-Type": "multipart/form-data"
    }});
}
// delete cover Photo  
export function deleteAttachments(id) {
    return userInstance.delete(`/deleteAttachment/${id}`);
}

// add Basic Info
export function updateBasicInfo(state) {
    return userInstance.post(`/basicInfo`,state);
}
// add experience
export function addExperience(state) {
    return userInstance.post(`/addExperiences`,state);
}
// delete experience
export function deleteExperience(id) {
    return userInstance.delete(`/deleteExperience/${id}`);
}
// edit experience
export function editExperience(id,state) {
    return userInstance.patch(`/editExperience/${id}`,state);
}

// add education
export function addEducation(state) {
    return userInstance.post(`/addEducation`,state);
}

// delete education
export function deleteEducation(id) {
    return userInstance.delete(`/deleteEducation/${id}`);
}

// edit education
export function editEducation(id,state) {
    return userInstance.patch(`/editEducation/${id}`,state);
}

// add certification
export function addCertification(state) {
    return userInstance.post(`/addCertifications`,state);
}

// delete certification
export function deleteCertification(id) {
    return userInstance.delete(`/deleteCertification/${id}`);
}

// edit certification
export function editCertification(id,state) {
    return userInstance.patch(`/editCertification/${id}`,state);
}

// add skills
export function addSkills(state) {
    return userInstance.post(`/addSkills`,state);
}
// delete skills
export function deleteSkill(id) {
    return userInstance.delete(`/deleteSkill/${id}`);
}
// edit skills
export function editSkill(id,state) {
    return userInstance.patch(`/editSkill/${id}`,state);
}

// add skills
export function addProjects(state) {
    return userInstance.post(`/addProjects`,state);
}
// delete skills
export function deleteProject(id) {
    return userInstance.delete(`/deleteProject/${id}`);
}
// edit skills
export function editProject(id,state) {
    return userInstance.patch(`/editProject/${id}`,state);
}

// fetchings notifications
export function getNotifications() {
    return userInstance.get(`/getNotifications`);
}
// deleting notifications
export function clearNotification(id) {
    return userInstance.delete(`/clearNotification/${id}`);
}

// deleting notifications
export function markAsRead() {
    return userInstance.patch(`/markAsRead`);
}