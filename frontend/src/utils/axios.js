import axios from "axios";

const API = axios.create({
  // baseURL: "",
  baseURL: "http://localhost:5000/api/",
  withCredentials: true, 
});

export default API;