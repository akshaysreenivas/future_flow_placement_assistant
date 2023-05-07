import { hrInstance } from "../axios";


// Hr login   
export function hrLogin(email, password) {
    return hrInstance.post("/login", {
        email,
        password,
    });
}

// posting job  
export function addJob(body) {
    return hrInstance.post("/addJob", body,{headers: {
        "Content-Type": "multipart/form-data"
    }});
}

// fetching all job posts    
export function getJobPosts(page,sort,search,limit,filter,status) {
    const url=`?page=${page}&sort=${sort.sort}&order=${sort.order}&status=${status}&department=${filter}&search=${search}&limit=${limit}`

    return hrInstance.get(`/getJobs/${url}`);
}

// fetching a single job details  
export function getJobDetails(id) {

    return hrInstance.get(`/getJobs/getdetails/${id}`);
}


// editing job details   
export function editJobDetails(state,id) {

    return hrInstance.put(`/editJobdetails/${id}`,state,{headers: {
        "Content-Type": "multipart/form-data"
    }});
}


// changing job status      
export function changeJobStatus(status ,id) {
    return hrInstance.patch("/changeJobStatus",{status,id});

}

// changing job status      
export function getCandidates(id,filter) {
    return hrInstance.get(`/getCandidates/${id}/?filter=${filter}`);

}

// changing job status      
export function getCandidateProfile(id) {
    return hrInstance.get(`/getCandidateProfile/${id}`,);

}


// changing job status      
export function changeCandidateStatus(id,candidate_id,status) {
    return hrInstance.patch(`/changeCandidateStatus/${id}`,{candidate_id ,status});

}

// change password  
export function changeHRPassword(password) {
    return hrInstance.put(`/changePassword`,{password});
}

// fetching datas for hr dashboard  
export function getHRDashboardDatas() {
    return hrInstance.get(`/getHRDashboardDatas`);
}

// downloading report  
export function downloadHRDashboardDatas() {
    //   calling api
    return hrInstance.get('/downloadhrDashboardDatas', { responseType: 'blob' });
}