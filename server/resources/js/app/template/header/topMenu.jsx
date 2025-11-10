import React, {useContext} from "react";

import { Logout} from "@mui/icons-material";
import useHttp from "../../store/hooks/http/useHttp";
import {Context} from "../../store/context/context";
import {NavLink, useNavigate} from "react-router-dom";
import {useQuery} from "react-query";

export default function TopMenu() {
    const http = useHttp();
    const {state,dispatch} = useContext(Context)
    const navigate = useNavigate();
    // start logout
    // const {data:data,loading:loading} = useFetch('menu/options','data');
    const { data: data, error, isLoading } = useQuery('top-menu',()=>{
        return  http.get('menu/options').then((res)=>{
            return res.data.data
        })
    });

    const logout = () => {
        http.post('logout').then((response)=>{
            if(response.status === 200){
                dispatch({type: 'AUTH', payload:false});
                localStorage.removeItem('token');
                return navigate('/login')
            }
        }).catch(err => {
            console.log(err.response)
        });
    }

    // const menuList = () => {
    //       return data?.templates&&data?.templates.map((item,index)=>{
    //           if(RoutePermissions(`view ${item.key}`)){
    //             return  <li key={index} className='d-flex align-items-center'><NavLink to={item.defaultSlug}><i className={' icon-font-size '+item.icon} ></i> {item.name} </NavLink></li>
    //           }
    //       });
    // }

    return <>
        <nav id='top-nav' className='container-xl d-flex justify-content-sm-between align-content-center' >
            <div className=' '>
                <NavLink to='/'>
                    <img className='pt-3 pb-3' height={'100'} src='/img/logo/logo.png' alt='' />
                </NavLink>
            </div>
            <ul className=''>
                {state.auth ===true &&<li className='d-flex align-items-center'>
                    <div className='pointer-event' onClick={() => logout()}>მოგესალმებით, {state.user?.name}<Logout/>გასვლა</div>
                </li>}
            </ul>

        </nav>
    </>

}
