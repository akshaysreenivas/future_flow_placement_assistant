import { hrInstance } from "../axios";


export async function createPasswordHr(password) {
    const { data } = await hrInstance.post(
        "/hr/createPassword",
        { password },
        { withCredentials: true }
    );
    return data
}
export async function hrLogin(email, password) {
    const { data } = await hrInstance.post("/login", {
        email,
        password,
    });
    return data
}

