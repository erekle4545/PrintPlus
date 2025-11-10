import React, {useContext} from 'react';
import {Context} from "../../context/context";
import {leaveAlert} from "./useAlert";
const UseFormLang = ({leave}) => {
    let {state,dispatch} = useContext(Context);
    const switchLang = (id,code,label) =>{
        dispatch({type:"FORM_ACTIVE_LANG",payload:{activeLangId:id ,code:code,label:label}})
    }
    const LangButtons = ()=>{
        return  state.form_lang.data?state.form_lang.data.map((item,index)=>{
            if(item.status === 1 ){
                return (<li key={index}><button title={item.label} className={item.id === state.form_active_lang.activeLangId?'active-form-lang':''} type='button' onClick={()=>leave?leaveAlert(switchLang,item.id,item.code,item.label):switchLang(item.id,item.code,item.label)}>{item.code}</button></li>)
            }
        }):'...Loading Languages'
    }
return LangButtons();
}
export default UseFormLang;