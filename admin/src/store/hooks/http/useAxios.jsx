import axios from "axios";

const Axios = axios.create();

Axios.defaults.baseURL = import.meta.env.VITE_DB;
Axios.defaults.withCredentials = true;

export default Axios;
