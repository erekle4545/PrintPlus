import React, {useContext, useEffect, useState} from "react";
import {Context} from '../../store/context/context';
import Swal from "sweetalert2";
import {errorAlerts, successAlerts} from "../../store/hooks/global/useAlert";
import {useAlert} from "react-alert";
const UploadFiles = (props) =>{

    const {dispatch} = useContext(Context);
    const [selectFile,setSelectFile] = useState('');
    const [selectFileName,setSelectFileName] = useState([]);
    const alerts = useAlert();
    const onFileChange = event => {
        // Update the state
        setSelectFile(event.target.files);
    };

    const onFileUpload = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success p-2 m-2',
                cancelButton: 'btn btn-danger p-2  m-2'
            },
            buttonsStyling: false
        })

        // Create an object of formData
        const formData = new FormData();
        // Update the formData object
        for (let i = 0 ; i < selectFile.length ; i++) {
            formData.append("file[]", selectFile[i],
                selectFile[i].name);

        }

        // Details of the uploaded file
        setSelectFile('')
        // alert check
        swalWithBootstrapButtons.fire({
            title: 'დარწმუნებული ხართ?',
            text: `ნამდვილად გსურთ ატვირთოთ ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ატვირთვა',
            cancelButtonText: 'გაუქმება',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                /// upload  server
                props.request.post(`image/resize?w=60%&folder_id=1`,formData).then((response)=>{
                    let time = new Date().getTime();
                    console.log(response)
                    if(response.status === 200 || response.status === 201){
                        dispatch({type:'UPLOAD_STATUS',payload:response.status+`_${time}`})
                        alerts.success('File Uploaded!')
                        // successAlerts(response.status, 'File Uploaded', 'ფაილი აიტვირთა')
                    }
                }).catch(err=>{
                    console.log(err.response)
                    errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
                });

                ///END upload  server
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                let time = new Date().getTime();
                dispatch({type:'UPLOAD_STATUS',payload:`_${time}`})
                swalWithBootstrapButtons.fire(
                    'გაუქმებულია',
                    'ფაილის ატვირთვა ჩაიშალა',
                    'error'
                )
            }
        })
    };

    return(
        <div className="form-group " >
            <div className='row align-items-center '>
                <div className='col-xl-12 p-0 '>
                    <div style={{display:!selectFile?'block':'none'}}>
                        <input type="file" id="input" onChange={onFileChange} multiple='multiple'  style={{"display":"none"}} />
                        <label  htmlFor={'input'} className={'btn btn-dark title_font'} style={{"color":"#ffffff","marginRight":"1rem"}} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                                <path
                                    d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                            </svg>
                            <span> აირჩიე ფაილი </span>
                        </label>
                    </div>
                    <div className='d-flex '>
                        <button onClick={onFileUpload} disabled={!selectFile}  className={'btn btn-success title_font'} style={{"color":"#ffffff",display:!selectFile?'none':'block'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                                <path
                                    d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                            </svg> <span> </span>
                            ატვირთვა
                        </button>
                       {selectFile.length > 0&&<h5 className='font_form_text font-weight-bold m-2'>არჩეულია {selectFile.length } ფაილი</h5>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UploadFiles;
