import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import {deleteAlert, errorAlerts} from "../global/useAlert";
import DeleteIcons from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
// My Hooks imported
import useHttp from "../http/useHttp";
import {Context} from "../../context/context";
const UseAddedBar = ({name,getUrl,deleteUrl}) => {
    // hooks
    let params = useParams();
    let http = useHttp();
    //Context
    let {state} = useContext(Context);
    // States
    const [loadingBar,setLoadingBar] = useState(false);
    const [pageBarData,setPageBarData] = useState([]);

    // Get Data
    const getDataPageBar = () => {
        setLoadingBar(true)
        http.get(getUrl+'/',{
            params:{
                language_id:state.form_active_lang.activeLangId?state.form_active_lang.activeLangId:1
            }
        }).then((response)=>{
            if(response.status === 200){
                setPageBarData(response.data.data)
                //resets()
            }
        }).catch(err=>{
            console.log(err.response)
        }).finally(()=>{
            setLoadingBar(false)
        });
    }
    // Delete Data
    const deletePage = (id) => {
        http.delete(deleteUrl+'/'+id).then((response)=>{
            if(response.status === 200){
                setPageBarData(pageBarData.filter(e=>e.id !== id))
            }
        }).catch(err => {
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
        })
    }

    useEffect(()=>{
        getDataPageBar()
    },[state.form_active_lang,params.id])

  return(<>
          <div className="card-header " style={{borderBottom:"1px dashed #a2a2a2"}} >
              <div className="row p-2" >
                  <div className='col-12  align-middle'>
                      <h5 className="card-title mb-0 pt-2"> ბოლოს დამატებული</h5>
                  </div>
              </div>
          </div>
          <div className='added_page_side p-3 '>
          {loadingBar?<p className='text-center p-5'>Loading Pages List...</p>:<ul className="added_page_class_list p-0">
              {pageBarData.length > 0?
                  pageBarData.map((item,index)=>{
                      let addedtime = item.info? new Date(item.info.created_at):'';
                      if(item.info){
                          return <li key={index}>
                              <div className="row">
                                  <div className='col-6 text-start font_form_text'>
                                      {item.info?<><h5 className=''>{item.info&&item.info.title}</h5>{params.id==item.info[name+'_id']?<span className='text-success font-weight-bold'>რედაქტირების პროცესში</span>:<span className={'text-green font-wdight-bold'}>{addedtime.toDateString()}</span>}</>:<span className='font-weight-bold text-danger'>სათარგმნი</span>}
                                  </div>
                                  <div className='col-6 text-end justify-content-between '>
                                      {params.id!=item.info[name+'_id']&&<Link to={`/${name}/edit/`+item.id} >
                                          <Fab   color="primary" aria-label="add" size={'small'} style={{zIndex:'8'}}>
                                              <EditIcon />
                                          </Fab>
                                      </Link>}
                                      <Fab style={{zIndex:'8'}} disabled={params.id==item.id&&'disabled'} onClick={()=>deleteAlert(item.id,deletePage)} color="error" aria-label="add" size={'small'}>
                                          <DeleteIcons />
                                      </Fab>
                                  </div>
                              </div>
                          </li>
                      }else{
                          return <li key={index}>
                              <div className="row">
                                  <div className='col-7 text-start font_form_text'>
                                      <span className='font-weight-bold '>არ არის ნათარგმნი</span>
                                      <p>არჩეული ენა: {state.form_active_lang.code}{params.id==item.id&&<p className='text-success '>რედაქტირების პროცესში</p>}</p>
                                  </div>
                                  <div className='col-5 text-end justify-content-between '>
                                      {params.id!=item.id&&<Link to={`/${name}/edit/`+item.id} >
                                          <Fab  style={{zIndex:'8'}} color="primary" aria-label="add" size={'small'} z-index={2}>
                                              <AddIcon />
                                          </Fab>
                                      </Link>}
                                      <Fab style={{zIndex:'8'}} disabled={params.id==item.id&&'disabled'} onClick={()=>deleteAlert(item.id,deletePage)} color="error" aria-label="add" size={'small'}>
                                          <DeleteIcons />
                                      </Fab>
                                  </div>
                              </div>
                          </li>
                      }
                  })
                  :<h6 className={'text-center text_font p-3'}>სია ცარიელია</h6>}
          </ul>}
      </div>
  </>)
}

export default UseAddedBar;