import { userInstance } from "../axios";

export function userLogin(email, password) {
    //   calling api
    return userInstance.post("/login", {
        email,
        password,
    });
}


export function getJobPosts(page,sort,search,limit,filter,status) {
    console.log("hhh",status)
    const url=`?page=${page}&sort=${sort.sort}&order=${sort.order}&status=${status}&department=${filter}&search=${search}&limit=${limit}`

    return userInstance.get(`/getJobs/${url}`);
}