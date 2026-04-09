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

//patch production by id
export const patchProduction = (id, productionData) => {
    return axiosInstance.patch(`/task/update/${id}`, productionData);
}

//delete production by id
export const deleteProduction = (id) => {
    return axiosInstance.delete(`/task/delete/${id}`);
} 

//get leader tasks 
export const getLeaderTasks = () => {
    return axiosInstance.get("/task/leader/tasks");
}

//get member tasks
export const getMemberTasks = () => {
    return axiosInstance.get("/task/member/tasks");
}

//patch task assignment
export const patchTaskAssignment = (id, assignmentData) => {
    return axiosInstance.patch(`/task/tasks-assignment/${id}`, assignmentData);
}