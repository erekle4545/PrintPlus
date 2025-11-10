import {Action} from "./action";

const reducers = (state, action) => {
    switch(action.type){
        case Action.AUTH:
            return {...state, auth: action.payload};
        case Action.NOTIFY:
            return {...state, notify: action.payload};
        case Action.R_TOKEN:
            return {...state, r_token: action.payload};
        case Action.ACCESS_TOKEN:
            return {...state, access_token: action.payload};
        case Action.USER:
            return {...state, user: action.payload};
        case Action.SELECTED_COVERS:
            return {...state, selected_covers: action.payload};
        case Action.SELECTED_COVERS_ID:
            return {...state, selected_covers_id: action.payload};
        case Action.SEARCH:
            return {...state, search: action.payload};
        case Action.CART:
            return {...state, cart: action.payload};
        case Action.EXEL_IMPORT:
            return {...state, exel_import: action.payload};
        case Action.UPLOAD_STATUS:
            return {...state, upload_status: action.payload};
        default:
            return state;
    }
}

export default reducers;