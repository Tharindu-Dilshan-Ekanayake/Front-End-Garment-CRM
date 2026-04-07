import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default publicApi;