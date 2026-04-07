//import axiosInstance from "./axiosInstance";
import publicApi from "./publicApi";

// login api
export const loginApi = (data) => {
    return publicApi.post('/auth/login', data);
}