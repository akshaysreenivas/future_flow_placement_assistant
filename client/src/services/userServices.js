import { userInstance } from "../axios";

export function userLogin(email, password) {
    //   calling api
    return userInstance.post("/login", {
        email,
        password,
    });
}