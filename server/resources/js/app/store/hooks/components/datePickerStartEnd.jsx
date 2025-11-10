import React from 'react';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
export default function DatePickerStartEnd({props,size}) {

    return (<div>
        <RangePicker
            style={{width:size?size:'auto', padding:'0.5rem'}}

            onChange={(values) => {
                const getCurrentDate =   values?.map(item=>{
                    return  new Date(item).toLocaleDateString()
                })
                props(getCurrentDate)

            }}

        />
    </div>);
}