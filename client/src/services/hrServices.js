import { hrInstance } from "../axios";



export function hrLogin(email, password) {
    return hrInstance.post("/login", {
        email,
        password,
    });
}

export function addJob(body) {
    return hrInstance.post("/addJob", body,{headers: {
        "Content-Type": "multipart/form-data"
    }});
}

export function getJobPosts(page,sort,search,limit,filter,status) {
    console.log("hhh",status)
    const url=`?page=${page}&sort=${sort.sort}&order=${sort.order}&status=${status}&department=${filter}&search=${search}&limit=${limit}`

    return hrInstance.get(`/getJobs/${url}`);
}

export function getJobDetails(id) {

    return hrInstance.get(`/getJobs/getdetails/${id}`);
}

export function changeJobStatus(status ,id) {
    return hrInstance.put("/changeJobStatus",{status,id});

}

