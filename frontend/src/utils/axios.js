import axios from "axios";

const API = axios.create({
  baseURL: "https://tnp-iiits.onrender.com/api/",
  // baseURL: "http://localhost:5000/api/",
  withCredentials: true, 
});

export default API;