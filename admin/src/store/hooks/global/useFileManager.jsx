import React, { useContext, useEffect, useState } from 'react';
import MediaList from "../../../modules/media/mediaList";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import DeleteIcons from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useHttp from "../http/useHttp";
import { Context } from "../../context/context";
import { useParams } from "react-router-dom";

const UseFileManager = ({ coverTypes, updateData }) => {
    const http = useHttp();
    const { state, dispatch } = useContext(Context);
    const params = useParams();

    const [fileManagerPopup, setFileManagerPopup] = useState(false);
    const [covers, setCovers] = useState(updateData);
    const [selectedCoverTypes, setSelectedCoverTypes] = useState([]);
    const [loadingCovers, setLoadingCovers] = useState(false);
    const [loading, setLoading] = useState(false);

    const fileURl = import.meta.env.VITE_FILE_URL;

    // Get Covers
    const getCover = () => {
        setFileManagerPopup(false);
        setLoadingCovers(true);
        setLoading(true);
        http.post(`covers`, {
            id: state.cart.toString()
        }).then((response) => {
            if (response.status === 200) {
                if (params.id) {
                    const getCover = response.data.data;
                    const filtered = getCover.filter(u =>
                        !updateData.some(g => g.id === u.id)
                    );
                    setCovers([...filtered, ...updateData]);
                } else {
                    setCovers(response.data.data);
                }
            }
        }).catch((err) => {
            console.log(err.response);
        }).finally(() => {
            setLoadingCovers(false);
            setLoading(false);
        });
    }

    useEffect(() => {
        if (params.id) {
            setCovers(updateData);
            const coversDataState = updateData.map(item => {
                return { coverType: item.cover_type, id: item.id };
            });
            const coversId = [];
            updateData.map(item => {
                coversId.push(`${item.id}`);
            });
            dispatch({ type: 'CART', payload: coversId });
            dispatch({ type: 'SELECTED_COVERS', payload: coversDataState });
        } else {
            setCovers([]);
            dispatch({ type: 'SELECTED_COVERS', payload: [] });
        }
    }, [updateData, state.form_active_lang, params.id]);

    // Disable body scroll when popup is open
    useEffect(() => {
        if (fileManagerPopup) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [fileManagerPopup]);

    // Cover lists
    const coverList = () => {
        return covers && covers.map(item => {
            return (
                <div key={item.id} className='col-6 p-0'>
                    <div className='image-delete'>
                        <Fab style={{ zIndex: '8' }} onClick={() => deleteCovers(item.id)} color="error" aria-label="add" size={'small'}>
                            <DeleteIcons />
                        </Fab>
                    </div>
                    <img
                        onClick={() => setFileManagerPopup(true)}
                        title='view file manager'
                        className="sidebar-image"
                        src={fileURl + '/' + item.output_path}
                    />
                    <FormControl sx={{ width: '100%', padding: '5px' }} size="small">
                        <InputLabel sx={{ padding: '5px' }} id={"covers_types_sidebar" + item.id}>Types</InputLabel>
                        <Select
                            key={item.id}
                            labelId={"covers_types_sidebar" + item.id}
                            id={"covers_types" + item.id}
                            defaultValue={item.cover_type || state.selected_covers.id}
                            onChange={(e) => handleChangeSelectCoverTypes(e, item.id)}
                            label={"Types" + item.id}
                        >
                            {coverTypes && coverTypes.map((items) => {
                                return <MenuItem key={items.id} value={items.id}>{items.description}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </div>
            );
        });
    }

    // covers selected types
    const handleChangeSelectCoverTypes = (e, id) => {
        const typedCover = Array.isArray(state.selected_covers) && state.selected_covers.filter(x => x.id !== id);
        setSelectedCoverTypes([...typedCover, { coverType: e.target.value, id: id }]);
        dispatch({ type: 'SELECTED_COVERS', payload: [...typedCover, { coverType: e.target.value, id: id }] });
    };

    // delete covers
    const deleteCovers = (id) => {
        setCovers(covers.filter((e) => parseInt(e.id) !== parseInt(id)));
        setSelectedCoverTypes(selectedCoverTypes.filter((e) => parseInt(e.id) !== parseInt(id)));
        dispatch({ type: 'SELECTED_COVERS', payload: state.selected_covers.filter((e) => parseInt(e.id) !== parseInt(id)) });
    }

    return (
        <>
            <label htmlFor="menuSwitch" className='pb-2 font_form_title font-weight-bold title_font'>ფოტოს არჩევა</label>
            <div className='input-style-border-switch file-upload-container --bs-gray-300'>
                {!covers.length && (
                    <div className='text-center'>
                        {loadingCovers || loading.editData ? '' : (
                            <button onClick={() => setFileManagerPopup(true)} className='file-upload-button' type='button'>
                                <img src='/img/avatars/upload-cloud-flat.png' alt={'ფაილის არჩევა'} />
                                <h4 className='title_font'>ფაილების არჩევა</h4>
                            </button>
                        )}
                    </div>
                )}
                <div className='img-covers-container p-2'>
                    {loadingCovers || loading ? (
                        <div className='text-center text_font fw-bolder p-5 m-auto'>
                            <CircularProgress />
                            <p className="text_font">იტვირთება...</p>
                        </div>
                    ) : coverList()}
                </div>
            </div>

            {/* Modal Overlay */}
            {fileManagerPopup && (
                <div
                    onClick={getCover}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                    }}
                />
            )}

            {/* Modal Popup */}
            {fileManagerPopup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90vw',
                    maxWidth: 1200,
                    height: '85vh',
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Modal Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 20px',
                        borderBottom: '1px solid #eee',
                        flexShrink: 0,
                        background: '#1a1a2e',
                    }}>
                        <span className="title_font" style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>
                            ფოტოს არჩევა
                        </span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {/*<button*/}
                            {/*    onClick={getCover}*/}
                            {/*    className="text_font"*/}
                            {/*    type="button"*/}
                            {/*    style={{*/}
                            {/*        background: '#4CAF50',*/}
                            {/*        color: '#fff',*/}
                            {/*        border: 'none',*/}
                            {/*        borderRadius: 6,*/}
                            {/*        padding: '6px 16px',*/}
                            {/*        fontSize: 13,*/}
                            {/*        fontWeight: 600,*/}
                            {/*        cursor: 'pointer',*/}
                            {/*        transition: 'background 0.2s',*/}
                            {/*    }}*/}
                            {/*    onMouseEnter={e => e.currentTarget.style.background = '#43A047'}*/}
                            {/*    onMouseLeave={e => e.currentTarget.style.background = '#4CAF50'}*/}
                            {/*>*/}
                            {/*    არჩევა*/}
                            {/*</button>*/}
                            <button
                                onClick={() => setFileManagerPopup(false)}
                                type="button"
                                style={{
                                    background: 'transparent',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: 6,
                                    width: 32,
                                    height: 32,
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* MediaList - takes remaining space and scrolls internally */}
                    <div style={{
                        flex: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                    }}>
                        <MediaList isModal />
                    </div>
                </div>
            )}
        </>
    );
}

export default UseFileManager;