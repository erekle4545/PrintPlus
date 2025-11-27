import React, {useContext, useEffect, useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {Context} from "../../store/context/context";
import Axios from "axios";
import useHttp from "../../store/hooks/http/useHttp";
import Box from "@mui/material/Box";
import topNavLangData from '../../language/langs/topNavLang.json';
const TopNav = () => {
    let navigate = useNavigate();
    let {state,dispatch} = useContext(Context);
    let http = useHttp();

    // start logout
    const logout = () => {
        http.post('logout').then((response)=>{
          if(response.status === 200){
              dispatch({type: 'AUTH', payload:false});
              localStorage.removeItem('token');
               // window.location.href=('/login');
               return navigate('/login')

          }
          }).catch(err => {

              console.log(err.response)
          });
    }
// End Logout

// Language
    const defaultLang = 'GE';
    const [formLang,setFormLang] = useState({
        activeLang:1,
        code:defaultLang
    })
    // lang show list
    const listLang = [
        {
            id:1,
            code:"GE",
            name:"ქართული",
            Location:"KA_ka"
        },
        {
            id:2,
            code:"US",
            name:"English",
            Location:"EN_en"
        },
        {
            id:3,
            code:"RU",
            name:"Russia",
            Location:"RU_ru"
        }
    ]


    const switchLang = (id,code) =>{
        dispatch({type: 'LANG', payload:{activeLang:id ,code:code}});
        setFormLang({activeLang:id ,code:code});
        localStorage.setItem('lang',code)
    }


    const LangButtons = listLang.map((item,index)=>{
        return (<div className="dropdown-item cursor-pointer" key={index} onClick={()=>switchLang(item.id,item.code)}>
            <Box component="span" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} >
                <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${item.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${item.code.toLowerCase()}.png 2x`}
                    alt=""
                />
            </Box>
            {item.code}
        </div>)
    })

    const translate = (translateName)=>{
        return  topNavLangData[translateName][state.lang.code]?topNavLangData[translateName][state.lang.code]:topNavLangData[translateName][localStorage.getItem('lang')]
    }
    // End translate Lang


    useEffect(()=>{
        // Language Change
            dispatch({type: 'LANG', payload:{activeLang:null ,code:localStorage.getItem('lang')?localStorage.getItem('lang'):defaultLang}});
            setFormLang({activeLang:null ,code:localStorage.getItem('lang')?localStorage.getItem('lang'):defaultLang});
            if(!localStorage.getItem('lang')){
                localStorage.setItem('lang',defaultLang)
            }
        // END Language
    },[])
  return(
      <>
          <nav className="navbar navbar-expand navbar-theme">
              <div onClick={()=> dispatch({type:'MENU_BOX',payload:state.menu_box!=='toggled'?'toggled':''})} className="sidebar-toggle d-flex me-2">
                  <i className="hamburger align-self-center"></i>
              </div>

              <form className="d-none d-sm-inline-block">
                  <input className="form-control form-control-lite text_font" type="text" placeholder={translate('search')}/>
              </form>

              <div className="navbar-collapse collapse">
                  <ul className="navbar-nav ms-auto">
                      <li className="nav-item dropdown ms-lg-2">
                          <a className="nav-link dropdown-toggle position-relative" href="#" id="userDropdown"
                             data-bs-toggle="dropdown">
                              {/*<i className="align-middle fas fa-language"></i>*/}
                              <Box component="span" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} >
                                  <img
                                      loading="lazy"
                                      width="20"
                                      src={`https://flagcdn.com/w20/${formLang.code.toLowerCase()}.png`}
                                      srcSet={`https://flagcdn.com/w40/${formLang.code.toLowerCase()}.png 2x`}
                                      alt=""
                                  />
                              </Box>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                              {LangButtons}
                          </div>
                      </li>
                      {/*Language*/}
                      <li className="nav-item dropdown ms-lg-2">
                          <a className="nav-link dropdown-toggle position-relative" href="#" id="userDropdown"
                             data-bs-toggle="dropdown">
                              <i className="align-middle fas fa-cog"></i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                              <a className="dropdown-item" href="#"><i
                                  className="align-middle me-1 fas fa-fw fa-user"></i> პროფილი</a>

                              <a className="dropdown-item" href="#"><i
                                  className="align-middle me-1 fas fa-fw fa-cogs"></i> პარამეტრები</a>
                              <div className="dropdown-divider"></div>
                              <button onClick={()=> logout()} className="dropdown-item" ><i  className="align-middle me-1 fas fa-fw fa-arrow-alt-circle-right"></i> გასვლა</button>
                          </div>
                      </li>
                  </ul>
              </div>
          </nav>
      </>
  )
}

export default TopNav;
