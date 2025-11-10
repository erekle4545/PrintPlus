import React from "react";
import useHttp from "../http/useHttp";

export  function  ExportExcel  (customUrl,fileName,format,id,datePicker,filterData){
    const http = useHttp();

    http.get(customUrl,{responseType: "arraybuffer",headers: { "Content-Type": "blob" }, params:{id:id,date_picker:datePicker,delivery_type:filterData.selectedDeliveryType}}).then((response)=>{
        const fileURL = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", `${fileName}.${format}`);
        document.body.appendChild(link);
        link.click();

    }).catch((err)=>{
        console.log(err.response)
    })

    return {}

}
