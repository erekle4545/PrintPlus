import {useContext, useEffect} from "react";
import {Context} from "../../context/context";
import useHttp from "../http/useHttp";
const UseGlobalRequestLang = () => {
    let {dispatch} = useContext(Context)
    let http = useHttp();
    const formLang = () => {
        // on loading
        dispatch({type:'LOADING',payload:true});

        http.get('languages').then((response)=>{
             if(response.status === 200){
                // set  all language
                dispatch({type:'FORM_LANG',payload:response.data});
                // find default language
                let findDefaultLang = response.data.data.filter(item => item.default === 1);
                dispatch({type:"FORM_ACTIVE_LANG",payload:{activeLangId: findDefaultLang[0].id,code:findDefaultLang[0].code,label:findDefaultLang[0].label}})

            }
        }).catch((err)=>{
            console.log(err.response)
        }).finally(()=>{
            dispatch({type:'LOADING',payload:false});
        });
    }

    useEffect(()=>{
        formLang()
    },[])

    return (<></>);
}


export default UseGlobalRequestLang;