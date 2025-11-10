import React, {useContext, useState} from "react";
import {Context} from "../../store/context/context";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {useAlert} from "react-alert";

export default function AddToCart({item,qty,disabled,label}){
    let {state,dispatch} = useContext(Context)
    const {cart} = state;
    const selectedCartItems = Array.isArray(cart)?cart:[];
    const alert = useAlert();
    const addToCartFunc = (item) => {

        // if(item?.colors?.length > 0){
            localStorage.setItem("cart",JSON.stringify(selectedCartItems?.map(x=>{return {id:x.id,qty:x.qty}})));
            const exist = selectedCartItems?.find(x=>x.id ===item.id);
            if(exist){
                dispatch({type: 'CART', payload:  cart.filter((x) => x.id !== item.id)});
                localStorage.setItem("cart",JSON.stringify(cart.filter((x) => x.id !== item.id).map(x=>{return {id:x.id,qty:x.qty}})));
                // alert.info(`ამოღებულია`);

            }else{
                dispatch({type: 'CART', payload:  [...selectedCartItems,{...item,qty:qty?qty:1}]});
                localStorage.setItem("cart",JSON.stringify(
                    [...selectedCartItems.map(x=>{return {id:x.id,qty:x.qty}}),{id:item.id,qty:qty?qty:1}]
                ));
                // alert.success(`დამატებულია კალათში`);

            }
        // }else{
        //     myAlert.error('აირჩიე ფერი');
        // }
    }

    const buttonColor = (data)=>{
        return selectedCartItems.map((x)=>x.id === data.id ? " activeProduct ":"");
    }

    return <>
        <button disabled={disabled} className={`title_font btn btn-sm  btn-warning ${buttonColor(item)}`} onClick={()=>addToCartFunc(item)}><AddShoppingCartIcon fontSize='small'/>{label}</button>
    </>

}
