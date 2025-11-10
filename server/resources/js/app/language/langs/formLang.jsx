import React from 'react';
import ka from  './langs/ka.json';
import en from  './langs/en.json';
import ru from  './langs/ru.json';
function FormLang(props) {

    switch (props.lang) {
        case 1:
            return ka[props.name];
        case 2:
            return en[props.name];
        case 3:
            return ru[props.name];
        default:
           return  ka[props.name];
    }
    // <FormLang lang={formLang.activeLang} name={'name'}/>
}
export default FormLang;