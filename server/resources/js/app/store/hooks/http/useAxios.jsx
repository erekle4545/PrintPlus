import Axios from "axios";
Axios.create();
Axios.defaults.baseURL = process.env.REACT_APP_DB;
// Axios.defaults.baseURL = 'http://localhost:8000/api/v2';
Axios.defaults.withCredentials = true;
export default Axios;
