import axiosInstance from "./axiosInstance";

export const getUsers = () => {
    return axiosInstance.get('/users');
}

export const getUserById = (id) => {
    return axiosInstance.get(`/users/${id}`);
}

export const createUser = (userData) => {
    return axiosInstance.post('/auth/register', userData);
}

export const patchUser = (id, userData) => {
    return axiosInstance.patch(`/users/${id}`, userData);
}

export const deleteUser = (id) => {
    return axiosInstance.delete(`/users/${id}`);
}

