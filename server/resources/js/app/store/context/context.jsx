import React,{createContext, useReducer} from "react";
import Reducers from './reducers';

export const Context = createContext();

export const Provider = ({children}) => {
    const initialState = {auth:{}, notify:{}, access_token:{}, r_token:{}, user:{},selected_covers:{},selected_covers_id:[],search:null,cart:[],exel_import:{},upload_status:{}}
    const [state, dispatch] = useReducer(Reducers, initialState)
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

