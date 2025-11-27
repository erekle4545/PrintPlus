import React,{useContext,useEffect} from "react";
import {  useNavigate } from "react-router-dom";
import {Context} from "../../context/context";
import useHttp from "./useHttp";
function LoginCheck() {
    let http = useHttp();
    const {state,dispatch} = useContext(Context);
    let navigate  = useNavigate();
    // Check login auth form user date , check localstorage
    useEffect(()=>{

        const accessTokens = localStorage.getItem('token');
        if(accessTokens){
            http.get("user").then((response)=>{
                if(response.status === 200){
                    dispatch({type: 'ACCESS_TOKEN', payload:accessTokens});
                    dispatch({type: 'AUTH', payload:true});
                    if(!accessTokens){
                        return   navigate('/login');
                    }
                }else{
                    dispatch({type: 'AUTH', payload:false});
                    localStorage.removeItem('token');
                     return   navigate('/login');
                }
            }).catch(err => {
                if(err.response.status === 401){
                    dispatch({type: 'AUTH', payload:false});
                    localStorage.removeItem('token');
                    return  navigate('/login');
                }
            });
        }

    },[])

    return !state.auth && <nvigate to="/login"  />
}

export default LoginCheck;