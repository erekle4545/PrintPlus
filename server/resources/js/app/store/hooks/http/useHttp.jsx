import useAxios from "./useAxios";
const UseHttp = () => {
        useAxios.interceptors.request.use(
            config =>{
                config.headers.authorization = `Bearer `+localStorage.getItem('token');
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        )
    return useAxios;
}
export default UseHttp;