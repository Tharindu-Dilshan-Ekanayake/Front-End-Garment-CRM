import axiosInstance from "./axiosInstance";
import publicApi from "./publicApi";

//get all productions
export const getProductions = () => {
    return axiosInstance.get('task/get-task');
}

//get production by id
export const getProductionById = (id) => {
    return publicApi.get(`/task/get-task/${id}`);
}

//create production
export const createProduction = (productionData) => {
    return axiosInstance.post('/task/create-task', productionData);
}