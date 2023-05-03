import { adminInstance } from "../axios";

// // login function
export function adminLogin(email, password) {
    //   calling api
    return adminInstance.post("/login", {
        email,
        password,
    });
}

// adding hr manager 
export function addHrManager(state) {
    //   calling api
    return adminInstance.post(
        "/addHrManagers",
        {
            username: state.name,
            email: state.email,
            company: state.company
        }

    );


}

// adding users 
export function addUsers(state) {
    //   calling api
    return adminInstance.post(
        "/addUsers",
        {
            username: state.name,
            studentID: state.studentId,
            email: state.email,
            department: state.department
        }
    );

}

// LISTING STUDENTS
export function getUsers(department,page,search) {
    //   calling api
    const url=`?page=${page}&department=${department}&search=${search}`
    return adminInstance.get(`/allStudents/${url}`);
}


// Listing HR Managers 
export function getHRManagers(hiring,search,page) {
    //   calling api
    const url=`?page=${page}&hiring=${hiring}&search=${search}`
    return adminInstance.get(`/allHRManagers/${url}`);
  

}

// blocking or unclocking the users 
export function changeUserStatus(status, id) {
    //   calling api
    return adminInstance.patch(
        "/ChangeUserStatus", { status, id },

    );
}

// blocking or unclocking the HR Manager 
export function changeHRStatus(status, id) {
    //   calling api
    return adminInstance.patch(
        "/ChangeHRStatus", { status, id },
    );

}


