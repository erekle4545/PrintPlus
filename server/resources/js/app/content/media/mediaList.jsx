import React, {useContext, useEffect, useState} from 'react';
import useHttp from "../../store/hooks/http/useHttp";
import UploadFiles from "./uploadFiles";
import {Context} from "../../store/context/context";
import {deleteAlert, errorAlerts} from "../../store/hooks/global/useAlert";
import IconButton from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import CircularProgress from '@mui/material/CircularProgress';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useAlert} from "react-alert";

const MediaList = () => {
    const {state,dispatch} = useContext(Context);
    let http = useHttp();
    let alert = useAlert();
    const [files,setFiles] = useState([]);
    const [check,setCheck] = useState([]);
    const [extensions,setExtensions] = useState([]);

    const [deleteStatus,setDeleteStatus] = useState(0);
    const [pagination, setPagination] = useState([]);
    const [postPagination, setPostPagination] = useState(1);
    const [loading, setLoading] = useState({
        filesList:false,
        uploads:false
    });
    const getFiles = () => {
        setLoading({filesList: true, uploads:false})
        http.get(`files?page=${postPagination}`,{
            params:{
                extensions:extensions
            }
        }).then((response)=>{
            if(response.status === 200){
                setFiles(response.data.data);
                setPagination(response.data.meta)
            }
        }).catch((err)=>{
            console.log(err)
        }).finally(() => {
            setLoading({filesList: false, uploads:false})
        });
    }

    // Delete
    const deleteRow = (id) => {
        http.delete('image/'+id).then((response)=>{
            setFiles(files.filter(e=> e.id !== id ))
            setDeleteStatus(check)

        }).catch(err => {
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
        })
    }

    // take check id
    const checkedDelete = (e) => {
        if(e.target.checked === true){
            setCheck([...check,e.target.value])
            dispatch({type:'SELECTED_COVERS_ID',payload:[...check,e.target.value]})
            alert.success('ფაილი მონიშნულია')
        }else{
            dispatch({type:'SELECTED_COVERS_ID',payload:check.filter(item => item !== e.target.value)})
            setCheck(check.filter(item => item !== e.target.value))
            alert.info('ფაილი ამოღებულია მონიშნულების სიიდან')
        }
    }

    // pagination
    const handleChangePagination = (e,value) => {
        setPostPagination(value)
    }

    const chooseExtensions = (e) => {
        if(e.target.checked === true){
            setExtensions([...extensions,e.target.value])
        }else {
            setExtensions(extensions.filter(item => item !== e.target.value))
        }

    }


    useEffect(()=>{
        getFiles()
        setCheck([])
        dispatch({type:'SELECTED_COVERS_ID',payload:[]})
    },[state.upload_status,deleteStatus,postPagination,extensions]);


    const fileList = () => {
      return  files.map((item,index)=>{
                return (<>
                    <li key={index} className='col-xl-2 col-sm-6 text-center' title={item.name}>
                        <label htmlFor={item.id}>
                            <img src={
                                item.extension === 'jpg' || item.extension === 'png' || item.extension === 'jpeg'?process.env.REACT_APP_FILE_URL+'/'+item.output_path:
                                item.extension === 'mp4' || item.extension === 'webm'?'/img/media/video_prev.png':
                                item.extension === 'pdf' || item.extension === 'dox'?'/img/media/doc.jpg':process.env.REACT_APP_FILE_URL+'/'+item.output_path
                            } alt={item.name}/>
                        </label>
                        <div className='d-flex media-file-tools' >
                            <div className='d-flex'>
                                <div title='delete' onClick={()=>deleteAlert(item.id,deleteRow)}><i className="align-middle me-2 fa fa-trash"></i></div>
                                <CopyToClipboard text={process.env.REACT_APP_FILE_URL+'/'+item.output_path}>
                                    <div title='Copy Link'>
                                        <i className="align-middle me-2 fa  fa-link"></i>
                                    </div>
                                </CopyToClipboard>
                                <div title='Eye'><i className="align-middle me-2 fa  fa-eye"></i></div>
                                <div className='text-uppercase'>{item.extension}</div>
                            </div>
                            <div><input key={item.id}  id={item.id} value={item.id} onChange={checkedDelete} type='checkbox' /></div>
                        </div>
                    </li>
                </>)
          })
    }


  return (
      <div className="col-md-12 col-xl-12 bg-w">
          <div className='card'>
              <div className="col-xl-12 p-3 align-items-center row p-1 ">
                  <div className='col-xl-2  col-sm-6'>
                        <h3 className="font_form_title font-weight-bold">Media Manager</h3></div>
                  <div className='col-xl-5  col-sm-6'>
                      <UploadFiles request={http}/>
                  </div>
                  <div className='col-sm-12 col-xl-5   '>
                      <div className="d-flex  justify-content-end">
                          <ul className='d-flex tools-ul justify-content-between '>
                              <li className='d-flex'> <input key={1} id='video' value='video' onChange={chooseExtensions} type='checkbox' /> <label htmlFor='video'>Video</label></li>
                              <li className='d-flex'> <input key={2} id='image' value='image' onChange={chooseExtensions} type='checkbox' /><label htmlFor='image'>Image</label> </li>
                              <li className='d-flex'> <input key={3}  id='documents' value='docs' onChange={chooseExtensions} type='checkbox' /> <label htmlFor='documents'>Documents</label></li>
                          </ul>
                          <IconButton variant='outlined' disabled={check.length > 0 ?'':'disabled'} onClick={()=> {deleteAlert(check, deleteRow);}}  color={'error'} aria-label="delete">
                              <DeleteIcon />
                          </IconButton>
                      </div>
                  </div>
              </div>
              <div className='col-xl-12 p-0 m-0 lite-background'>
                  {loading.filesList? <div className='text-center p-5'><CircularProgress /><p>Loading Data...</p></div> :<ul className='media-lists p-3'>{fileList()}</ul>}
              </div>
              <div className='col-12 p-4 d-flex justify-content-end'><Pagination count={pagination.last_page}  onChange={handleChangePagination} color="standard" /></div>
          </div>
      </div>
  )
}

export default MediaList;