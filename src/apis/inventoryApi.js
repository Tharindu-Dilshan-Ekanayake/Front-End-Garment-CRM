import axiosInstance from "./axiosInstance";

//get all inventory items
export const getInventoryItems = () => {
    return axiosInstance.get('/inventory');
}

//get by id
export const getInventoryItemById = (id) => {
    return axiosInstance.get(`/inventory/${id}`);
}

// create new inventory item
export const createInventoryItem = (data) => {
    return axiosInstance.post('/inventory', data);
}

// update inventory item by id
export const updateInventoryItem = (id, data) => {
    return axiosInstance.patch(`/inventory/${id}`, data);
}

// delete inventory item by id
export const deleteInventoryItem = (id) => {
    return axiosInstance.delete(`/inventory/${id}`);
}