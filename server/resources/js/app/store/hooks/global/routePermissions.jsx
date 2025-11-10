import {useContext} from "react";
import {Context} from "../../context/context";

export const RoutePermissions = (method)=>{
   let {state} = useContext(Context);
   const checkPermission = state.user.roles?.[0].permissions.some(item=> item.name === method);
   return checkPermission;

}