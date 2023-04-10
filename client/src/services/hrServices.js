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
    console.log("hhh",status)
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

