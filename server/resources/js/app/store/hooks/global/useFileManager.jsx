import React, {useContext, useEffect, useState} from 'react';
import MediaList from "../../../content/media/mediaList";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import DeleteIcons from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useHttp from "../http/useHttp";
import {Context} from "../../context/context";
import {useParams} from "react-router-dom";

const UseFileManager = ({coverTypes,updateData}) => {

    let http = useHttp();
    let {state,dispatch} = useContext(Context);
    let params = useParams();

    const [fileManagerPopup,setFileManagerPopup] = useState(false)
    const [covers, setCovers] = useState(updateData);
    const [selectedCoverTypes, setSelectedCoverTypes] = useState([]);
    const [loadingCovers, setLoadingCovers] = useState(false);
    const [loading, setLoading] = useState(false);



    //Get Covers
    const getCover = () => {

        setFileManagerPopup(false)
        setLoadingCovers(true)
        http.post(`covers`,{
            id:state.selected_covers_id.toString()
        }).then((response)=>{
            if(response.status === 200){
                if(params.id){
                    const getCover = response.data.data;
                    //setCovers([...covers,...getCover]);
                    setCovers([...updateData,...getCover]);
                }else{
                    setCovers(response.data.data);
                }
                // localStorage.setItem('covers',JSON.stringify(response.data.data))
            }
        }).catch((err)=>{
            console.log(err.response)
        }).finally(() => {
            setLoadingCovers(false)
        });
    }

        useEffect(()=>{

            if(params.id){
                setCovers(updateData)
                // get cover
                const coversDataState =updateData.map(item=> {
                    return {coverType:item.cover_type,id:item.id}
                })

                const coversId = []

                updateData.map(item=> {
                    coversId.push(`${item.id}`)
                })

                dispatch({type:'SELECTED_COVERS_id',payload:coversId})
                dispatch({type:'SELECTED_COVERS',payload:coversDataState})
            }else{
                setCovers([])
                dispatch({type:'SELECTED_COVERS',payload:[]})
            }

        },[updateData,params.id])

    // Cover lists
    const coverList = () => {
        return covers&&covers.map(item=>{
            return (
                <div key={item.id} className='col-6 p-0 ' >
                    <div  className='image-delete' >
                        <Fab style={{zIndex:'8'}} onClick={()=>deleteCovers(item.id)} color="error" aria-label="add" size={'small'}>
                            <DeleteIcons />
                        </Fab>
                    </div>
                    <img  onClick={() => setFileManagerPopup(true)} title='view file manager' className="sidebar-image" src={process.env.REACT_APP_FILE_URL+'/'+item.output_path}/>
                    <FormControl sx={{  width: '100%',padding:'5px' }} size="small">
                        <InputLabel  sx={{  padding:'5px' }}  id={"covers_types_sidebar"+item.id}>Types</InputLabel>
                        <Select
                            key={item.id}
                            labelId={"covers_types_sidebar"+item.id}
                            id={"covers_types"+item.id}
                            defaultValue={item.cover_type||state.selected_covers.id}
                            onChange={(e)=>handleChangeSelectCoverTypes(e,item.id)}
                            label={"Types"+item.id}
                        >
                            {coverTypes&&coverTypes.map((items,index)=>{
                                return  <MenuItem key={items.id} value={items.id}>{items.description}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
            )
        })
    }

    // covers selected types
    const handleChangeSelectCoverTypes = (e,id) => {
        //    const typedCover = selectedCoverTypes.filter(x=> x.id !== id);
        //         setSelectedCoverTypes([...typedCover,{coverType:e.target.value,id:id}]);

        const typedCover = Array.isArray(state.selected_covers)&&state.selected_covers.filter(x=> x.id !== id);
        setSelectedCoverTypes([...typedCover,{coverType:e.target.value,id:id}]);

        dispatch({type:'SELECTED_COVERS',payload:[...typedCover,{coverType:e.target.value,id:id}]})

    };
    // delete covers
    const deleteCovers = (id) => {
        setCovers(covers.filter((e)=>e.id != id))
        setSelectedCoverTypes(selectedCoverTypes.filter((e)=>e.id != id))
        dispatch({type:'SELECTED_COVERS',payload:state.selected_covers.filter((e)=>e.id != id)})
        //  localStorage.setItem('covers',JSON.stringify(covers.filter((e)=>e.id != id)))
    }

    return (<>
        {/*<label htmlFor="menuSwitch" className='pb-2 font_form_title font-weight-bold'>ფოტოს არჩევა</label>*/}
        <div className='input-style-border-switch file-upload-container --bs-gray-300'>
            {!covers.length &&<div className='text-center'>
                {loadingCovers || loading.editData?'':
                    <button onClick={() => setFileManagerPopup(true)} className='file-upload-button' type='button'>
                    <img src='/img/avatars/upload-cloud-flat.png'/>
                    <h6 className='title_font p-3'>ფაილების ატვირთვა</h6>
                </button>}
            </div>}
            <div className='img-covers-container p-0'>
                {loadingCovers || loading ?  <div className='text-center p-5 m-auto'><CircularProgress /> <p>LOADING...</p></div>:coverList()}
                {/*{covers.length?<div className='col-6 ' onClick={() => setFileManagerPopup(true)}>*/}
                {/*    <div className='m-1 plus-cover '>*/}
                {/*        <img src="/img/avatars/upload-cloud-flat.png"/>*/}
                {/*    </div>*/}
                {/*</div>:''}*/}
            </div>
        </div>
        <div className='file-manager-popup' style={{display: fileManagerPopup?'block': 'none'}} >
            <div onClick={getCover} className='close text-end color-white'>
                <span onClick={()=>setFileManagerPopup(false)}>x</span>
            </div>
            <MediaList/>
        </div>
        <div style={{display: fileManagerPopup?'block': 'none'}} onClick={getCover} className='popup-back'></div>
    </>)
}
export default UseFileManager