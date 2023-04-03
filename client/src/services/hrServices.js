import { hrInstance } from "../axios";



export function hrLogin(email, password) {
    return hrInstance.post("/login", {
        email,
        password,
    });

}
export function addJob(values) {
    return hrInstance.post("/addJob", values);
}

export function getJobPosts() {
    return hrInstance.post("/getJobs");
}

export function changeJobStatus(status ,id) {
    return hrInstance.post("/changeJobStatus",{status,id});

}

