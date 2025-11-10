import React from 'react';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {Typography} from "@mui/material";



export default function  GetAutocomplete({data},setCustomerDataFunc) {
    const defaultProps = {
        options: data?.sort((a, b) => a.surname < b.surname ? -1 : (a.surname > b.surname ? 1 : 0)),
        getOptionLabel: (option) => {
            return   option.surname+' | '+option.phone
        },
    }
    return <>  <Autocomplete
        {...defaultProps}

        disablePortal
        id="combo-box-demo"
        onChange={(e,value,reason) => {
            // setCustomerDataFunc(value)
        }}

        renderInput={(params) => <TextField {...params} label="მომხმარებლები" />}
    /></>
}