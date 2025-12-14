import React,{createContext, useReducer} from "react";
import Reducers from './reducers';

export const Context = createContext();

export const Provider = ({children}) => {
    const initialState = {auth:{}, loading:false, notify:{}, access_token:{}, r_token:{}, user:{}, lang:{},form_lang:{},form_active_lang:{},selected_covers:{},menu_box:{},search:{},cart:{},exel_import:{},upload_status:{}}
    const [state, dispatch] = useReducer(Reducers, initialState)
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

