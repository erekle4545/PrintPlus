import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {errorAlerts, successAlerts} from "../../../store/hooks/global/useAlert";
import useHttp from "../../../store/hooks/http/useHttp";
import {Context} from "../../../store/context/context";
import {CheckBox, Update} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useQuery} from "react-query";

export default  function Permissions() {
    const http = useHttp();
    const navigate = useNavigate();
    const params = useParams();
    const {state} = useContext(Context);
    const [allPermission,setAllPermission] = useState([]);
    const [rolePermission,setRolePermission] = useState(null)
    const [loading,setLoading] = useState(false);
    const [checkedPermission,setCheckedPermission] = useState([]);

    const [itemsChecked, setItemsChecked] = useState([]);
    const [itemsAllChecked, setItemsAllChecked] = useState([]);

   const {data:menuData,error:error} = useQuery('top-menu');

    const permissions = ()=>{
        http.get("permissions").then((response)=>{
            console.log(response)
            response.data.data.map(item => {
                setAllPermission(response.data.data)
            })
        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data)
        });
    }

    const role = ()=>{
        setLoading(true)
        http.get(`role/${params.id}`).then((response)=>{
            if(response.status === 200){
                setRolePermission(...response.data.data);
                const dataForCheckPermission = [];
                response.data.data[0].permissions.map((item)=>{
                    dataForCheckPermission.push(item.id)
                });
                setCheckedPermission([...checkedPermission,...dataForCheckPermission])
                if(response.data.data.length === 0) {
                    errorAlerts('401','pageNotFound','');
                    // navigate('/404')
                }
            }
        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data);
            // navigate('/404')
        }).finally(()=>{
            setLoading(false)
        });
    }


    const updateRolePermission = () => {
        http.put(`update_route_permissions_menu`, {
            permissions:checkedPermission,
            role_id:rolePermission?.id
        }).then((response) => {
            // console.log(response)
                // const checkedData = []
                // if(response.status === 200){
                //     response.data.data.permissions.map((item)=>{
                //         checkedData.push(item.id)
                //     });
                //     setCheckedPermission(checkedData)
                //     successAlerts(200,'done','updated');
                // }
            if(response.status === 200) {
                successAlerts(200, 'done', 'updated');
            }

        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data)
        });
    }

    // check box
    const checkboxTarget = (e) => {
        if(e.target.checked===true){
            setCheckedPermission([...checkedPermission,parseInt(e.target.value)]);
        }else{
            setCheckedPermission(checkedPermission.filter(item => parseInt(item) !== parseInt(e.target.value)))

        }
    }

    /** select all function for menu
     *
     * @returns {*}
     */

        // handle checked box click
    const handleCheckboxClick = (e) => {
            const { value, checked } = e.target;
            if (checked === true) {
                setCheckedPermission([...checkedPermission, parseInt(value) ]);
            } else {
                setCheckedPermission(checkedPermission.filter((item) => parseInt(item) !== parseInt(value)));
            }
        };

    // parent select all
    const selectItemAll = (e,menuChildren) => {
        const { checked,value } = e.target;
        const collection = [];
        const childrenMenuIds = [];
        Array.isArray(menuChildren)&&menuChildren.map((childItem,number)=> {
            childrenMenuIds.push(childItem.id)
            Array.isArray(allPermission) && allPermission.map((permissionItem, number) => {
                const permissionNameParentMenu = permissionItem.name.split(' ').slice(1).toString().replace(',', '_')
                if (permissionNameParentMenu === childItem.key) {
                    collection.push(permissionItem.id);
                }
            })
        });

        if (checked === true) {
            setItemsChecked([...itemsChecked,...childrenMenuIds,parseInt(value)]);
            setCheckedPermission([...checkedPermission,...collection]);
            setItemsAllChecked([...itemsAllChecked,parseInt(value)]);

        }else{
            setItemsAllChecked(itemsAllChecked.filter(e=>e !== parseInt(value)));

            let _dataIds = [...itemsChecked]
            childrenMenuIds.forEach(rd => {
                _dataIds =  _dataIds.filter(t => parseInt(t) !== parseInt(rd));
            });
            setItemsChecked(_dataIds);

            let _data = [...checkedPermission]
            collection.forEach(rd => {
                _data =  _data.filter(t => parseInt(t) !== parseInt(rd));
            });
            setCheckedPermission(_data);
        }
    };
    // inside select all
    const selectItem = (e,menuKey) => {
        const { checked,value } = e.target;
        const collection = [];
        // parse permissions
        Array.isArray(allPermission)&&allPermission.map((permissionItem,number)=> {
            const  permissionNameParentMenu = permissionItem.name.split(' ').slice(1).toString().replace(',','_')
            const defaultChecked = rolePermission.permissions.some(e => e.id === permissionItem.id)
            if(permissionNameParentMenu === menuKey)
            {
                collection.push(permissionItem.id);
            }
        })
        if (checked === true) {
            setItemsChecked([...itemsChecked,parseInt(value)]);
            setCheckedPermission([...checkedPermission,...collection]);
        }else{
            setItemsChecked(itemsChecked.filter(e=>e !== parseInt(value)));

            let _data = [...checkedPermission]
            collection.forEach(rd => {
                _data =  _data.filter(t => parseInt(t) !== parseInt(rd));
            });
            setCheckedPermission(_data);

        }
    };


    const menuListForPermission = () => {
        return Array.isArray(menuData?.templates)&&menuData?.templates.map((item,index)=>{

            return (<li key={index} className='sidebar-link '>
                <i className={`align-middle me-2 fas fa-fw ${item.icon}`}></i>
                <span>{item.name}</span>
                <div className=' d-flex' key={index}>
                    {Array.isArray(allPermission)&&allPermission.map((permissionItem,number)=> {
                        const  permissionNameParentMenu = permissionItem.name.split(' ').slice(1).toString().replace(',','_')
                        //console.log(permissionNameParentMenu+""+item.key)
                        const defaultChecked = rolePermission.permissions.some(e => e.id === permissionItem.id)
                        if(permissionNameParentMenu === item.key)
                            return (
                                <div className='p-3'>
                                    <input type='checkbox' className='m-2' key={permissionItem.id+index} value={permissionItem.id} defaultChecked={defaultChecked} id={`id`+permissionItem.id}  onChange={checkboxTarget}/>
                                    {/*<CheckBox key={permissionItem.id+index} value={permissionItem.id} defaultChecked={defaultChecked} id={`id`+permissionItem.id}  onChange={checkboxTarget}   color="secondary"/>*/}
                                    <label className='cursor-pointer' htmlFor={`id`+permissionItem.id}>{permissionItem.name}</label>
                                </div>
                            )
                    })}
                </div>
            </li>)
            // if(item.children.length > 0){
            //
            //     const selectAllIdKey = item.id;
            //
            //     return (<li key={index}  className="sidebar-item title_font">
            //
            //         <div className="d-flex">
            //             <Link  data-bs-target={"#permission_menu"+item.key}  data-bs-toggle="collapse" className="sidebar-link collapsed">
            //                 <i className={`align-middle me-2 fas fa-fw ${item.icon}`}></i><span
            //                 className="align-middle">{menuInfo.title}</span>
            //             </Link>
            //             <CheckBox
            //                 checked={itemsAllChecked.some(e=> e === parseInt(item.id))  } onClick={(e)=>selectItemAll(e,item.children)}
            //                 value={selectAllIdKey}
            //             />
            //         </div>
            //         {childMenu()&&<ul id={'permission_menu'+item.key} className=' collapse' data-bs-parent={"#permission_menu"+item.key}>
            //             {childMenu()}
            //         </ul>}
            //     </li>)
            // }else{
            //     return (<li key={index} className='sidebar-link '>
            //         <i className={` align-middle me-2 fas fa-fw ${item.icon}`}></i>
            //         <span>menuInfo.title</span>
            //         <div className=' d-flex' key={index}>
            //             {Array.isArray(allPermission)&&allPermission.map((permissionItem,number)=> {
            //                 const  permissionNameParentMenu = permissionItem.name.split(' ').slice(1).toString().replace(',','_')
            //                 //console.log(permissionNameParentMenu+""+item.key)
            //                 const defaultChecked = rolePermission.permissions.some(e => e.id === permissionItem.id)
            //
            //                 if(permissionNameParentMenu === item.key)
            //
            //                     return (
            //                         <div>
            //                             <CheckBox key={permissionItem.id+index} value={permissionItem.id} defaultChecked={defaultChecked} id={`id`+permissionItem.id}  onChange={checkboxTarget}   color="secondary"/>
            //                             <label className='cursor-pointer' htmlFor={`id`+permissionItem.id}>{permissionItem.name}</label>
            //                         </div>
            //                     )
            //             })}
            //         </div>
            //     </li>)
            // }
        })
    }


    useEffect(()=>{
        permissions();
        role();
    },[])



    return (
        <div className="col-md-12 col-xl-12 bg-w page-animation">
            <div className="card">
                <div className="card-header lite-background">
                    <div className="row justify-content-end align-items-center">
                        <div className="col-xl-6 col-sm-6 text-left text-sm-center d-flex">
                            <h5 className="card-title mb-0 p-2"><i className="fa fa-server"  aria-hidden="true"></i> ნებართვები</h5>
                        </div>
                        <div className="col-xl-6 col-sm-6 text-right text-sm-center">
                            <div className="card-actions float-end">
                                <ul className="nav lang">
                                    <li>
                                        <Button onClick={()=>navigate(-1)} className='title_font' >
                                            <i className="fa fa-chevron-circle-left"  aria-hidden="true"></i>&nbsp;
                                            back
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {loading?'იტვირთება ....':<div className='p-5'>
                        <h1 className='text_font'>{rolePermission?.name}-(ის) ნებართვები </h1>
                        <ul className='list-unstyled  col-md-12 col-ms-12 pt-3'>{menuListForPermission()}</ul>
                        <Button  variant="contained"  color='secondary'  style={{backgroundColor:'#1076fb'}}  startIcon={<Update></Update>} onClick={updateRolePermission}>განახლება</Button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

