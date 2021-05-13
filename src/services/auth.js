import http from "../http-common"
import authHeader from "./auth-header";

export function login({ username, password }) {
    return http
        .post("/auth/signin", {
            username,
            password
        })
        .then(response => {
            return response.data;
        });
}


export function register({username, fechaNacimiento, role, password, firstName, secondName, phoneNumber }) {
    return http
        .post("/auth/signup", {
            username,
            fechaNacimiento,
            role,
            password,
            firstName,
            secondName,
            phoneNumber
        })
        .then(response => {
            return response.data;
        });
}


export function update({ username, email, oldPassword, password, confirmPassword }) {
    return http
        .post("/auth/updateProfile", {
            username,
            email,
            oldPassword,
            password,
            confirmPassword
        })
        .then(response => {
            return response.data;
        });
}

export function updateBraintreeData(data) {
    return http
        .patch("/auth/updateBraintree", data, {headers: authHeader()})

}

export function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
}