import React, {useContext, useEffect, useState, useRef} from "react";
import {Context} from "../store/context/context";
import {translate} from "../store/hooks/useMix";
import useHttp from "../store/hooks/http/useHttp";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import OrderDashboardStats from "./home/Orderdashboardstats.jsx";

// Animated number component
const AnimatedNumber = ({ value, duration = 1200 }) => {
    const [display, setDisplay] = useState(0);
    const animRef = useRef(null);
    const numValue = parseInt(value) || 0;

    useEffect(() => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        if (numValue === 0) { setDisplay(0); return; }

        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * numValue));
            if (progress < 1) {
                animRef.current = requestAnimationFrame(animate);
            } else {
                setDisplay(numValue);
            }
        };
        animRef.current = requestAnimationFrame(animate);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [numValue, duration]);

    return <>{display}</>;
};

const HomePage = () => {
    let {state, dispatch} = useContext(Context);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState('');
    const [color, setColor] = useState('#6610f2');
    const [text, setText] = useState('');
    let http = useHttp();

    const getData = () => {
        setLoading(true);
        http.get('dashboard').then((response) => {
            if (response.status === 200) {
                setData(response.data);
            }
        }).catch(err => {
            console.log(err.response);
        }).finally(() => {
            setLoading(false);
        });
    };

    const saveCard = () => {
        const newCard = { color, date, text };
        dispatch({
            type: 'NOTIFY',
            payload: state.notify.length > 0
                ? [newCard, ...state.notify]
                : [newCard]
        });
        setText('');
    };

    useEffect(() => {
        getData();
    }, []);

    const dashboardCards = [
        {
            title: 'გვერდები',
            value: data.pages,
            icon: 'fas fa-file-alt',
            color: '#3B7DDD',
            bgColor: 'rgba(59,125,221,0.12)'
        },
        {
            title: 'მომხმარებლები',
            value: data.users,
            icon: 'fas fa-users',
            color: '#28a745',
            bgColor: 'rgba(40,167,69,0.12)'
        },
        {
            title: 'კატეგორიები',
            value: data.categories,
            icon: 'fas fa-folder-open',
            color: '#fd7e14',
            bgColor: 'rgba(253,126,20,0.12)'
        },
        {
            title: 'ფაილები',
            value: data.files,
            icon: 'fas fa-images',
            color: '#6f42c1',
            bgColor: 'rgba(111,66,193,0.12)'
        }
    ];

    return (
        <>
            <style>{`
                /* ===== Header ===== */
                .dashboard-header {
                    margin-bottom: 1.5rem;
                }
                .dashboard-header h1 {
                    margin-bottom: 0.25rem;
                }
                .dashboard-header p {
                    margin: 0;
                }

                /* ===== CMS Stats Grid ===== */
                .cms-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                @media (max-width: 992px) {
                    .cms-stats-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 576px) {
                    .cms-stats-grid { grid-template-columns: 1fr; }
                }

                .cms-stat-card {
                    background: #fff;
                    border-radius: 8px;
                    padding: 1.25rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    border: 1px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    opacity: 0;
                    transform: translateY(16px);
                    animation: cms-card-in 0.45s ease forwards;
                    transition: box-shadow 0.25s ease, transform 0.25s ease;
                }
                .cms-stat-card:hover {
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                .cms-stat-card:nth-child(1) { animation-delay: 0.05s; }
                .cms-stat-card:nth-child(2) { animation-delay: 0.12s; }
                .cms-stat-card:nth-child(3) { animation-delay: 0.19s; }
                .cms-stat-card:nth-child(4) { animation-delay: 0.26s; }

                @keyframes cms-card-in {
                    to { opacity: 1; transform: translateY(0); }
                }

                .cms-stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    flex-shrink: 0;
                    transition: transform 0.3s ease;
                }
                .cms-stat-card:hover .cms-stat-icon {
                    transform: scale(1.1);
                }

                .cms-stat-info {
                    flex: 1;
                    min-width: 0;
                }
                .cms-stat-title {
                    font-size: 0.8rem;
                    color: #6c757d;
                    font-weight: 500;
                    margin-bottom: 0.15rem;
                }
                .cms-stat-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #212529;
                    line-height: 1.2;
                }

                /* ===== Notepad Section ===== */
                .notepad-card {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    border: 1px solid #e9ecef;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    opacity: 0;
                    animation: cms-card-in 0.5s ease 0.35s forwards;
                }
                .notepad-header {
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }
                .notepad-header-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: rgba(111,66,193,0.12);
                    color: #6f42c1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                }
                .notepad-header h6 {
                    margin: 0;
                    font-weight: 600;
                    color: #212529;
                }
                .notepad-body {
                    padding: 1.25rem;
                }
                .notepad-controls {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .color-picker-wrap {
                    position: relative;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid #e9ecef;
                    flex-shrink: 0;
                    transition: border-color 0.2s ease;
                }
                .color-picker-wrap:hover {
                    border-color: #adb5bd;
                }
                .color-picker-wrap input[type="color"] {
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    width: calc(100% + 8px);
                    height: calc(100% + 8px);
                    border: none;
                    cursor: pointer;
                    background: none;
                }
                .notepad-submit {
                    margin-top: 1rem;
                }
            `}</style>

            {/* Header */}
            <div className="dashboard-header header">
                <h1 className="header-title title_font">
                    {translate('welcome', state.lang.code)} {state.user.name}!
                </h1>
                <p className="header-subtitle text_font">
                    {translate('seeStatistics', state.lang.code)}
                </p>
            </div>

            {/* Order Statistics */}
            <OrderDashboardStats />

            {/* CMS Stats */}
            <div className="cms-stats-grid">
                {dashboardCards.map((card, index) => (
                    <div className="cms-stat-card" key={index}>
                        <div
                            className="cms-stat-icon"
                            style={{ background: card.bgColor, color: card.color }}
                        >
                            <i className={card.icon}></i>
                        </div>
                        <div className="cms-stat-info">
                            <div className="cms-stat-title text_font">{card.title}</div>
                            <div className="cms-stat-value">
                                {loading
                                    ? <span style={{ fontSize: '1rem', color: '#adb5bd' }}>...</span>
                                    : <AnimatedNumber value={card.value} />
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Notepad */}
            {/*<div className="notepad-card">*/}
            {/*    <div className="notepad-header">*/}
            {/*        <div className="notepad-header-icon">*/}
            {/*            <i className="fas fa-sticky-note"></i>*/}
            {/*        </div>*/}
            {/*        <h6 className="title_font">ჩანაწერების ბლოკნოტი</h6>*/}
            {/*    </div>*/}
            {/*    <div className="notepad-body">*/}
            {/*        <TextField*/}
            {/*            required*/}
            {/*            onChange={(e) => setText(e.target.value)}*/}
            {/*            value={text}*/}
            {/*            fullWidth*/}
            {/*            label="ჩანაწერი"*/}
            {/*            variant="outlined"*/}
            {/*            size="small"*/}
            {/*            className="font_form_title"*/}
            {/*        />*/}
            {/*        <div className="notepad-controls">*/}
            {/*            <TextField*/}
            {/*                size="small"*/}
            {/*                label="თარიღი"*/}
            {/*                type="date"*/}
            {/*                defaultValue={new Date().toISOString().split('T')[0]}*/}
            {/*                sx={{ width: 180 }}*/}
            {/*                InputLabelProps={{ shrink: true }}*/}
            {/*                onChange={(e) => setDate(e.target.value)}*/}
            {/*                className="font_form_title"*/}
            {/*            />*/}
            {/*            <div className="color-picker-wrap">*/}
            {/*                <input*/}
            {/*                    type="color"*/}
            {/*                    value={color}*/}
            {/*                    onChange={(e) => setColor(e.target.value)}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="notepad-submit">*/}
            {/*            <Button*/}
            {/*                className="font_form_title"*/}
            {/*                disabled={!text}*/}
            {/*                onClick={saveCard}*/}
            {/*                variant="contained"*/}
            {/*                size="small"*/}
            {/*            >*/}
            {/*                <i className="fas fa-plus me-1" style={{ fontSize: '0.75rem' }}></i>*/}
            {/*                ბარათის შექმნა*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
};

export default HomePage;
// import React, {useContext, useEffect, useState} from "react";
// import {Context} from "../store/context/context";
// import {translate} from "../store/hooks/useMix";
// import useHttp from "../store/hooks/http/useHttp";
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import OrderDashboardStats from "./home/Orderdashboardstats.jsx";
//
//
// const HomePage = ()=>{
//     let {state,dispatch} = useContext(Context);
//     const [data,setData] = useState([]);
//     const [loading,setLoading] = useState(false);
//     const [cardData,setCardData] = useState([]);
//     const [date,setDate] = useState('');
//     const [color,setColor] = useState('');
//     const [text,setText] = useState('');
//     let http = useHttp();
//
//     const getData = () => {
//         setLoading(true)
//         http.get('dashboard').then((response)=>{
//             if(response.status === 200){
//                 setData(response.data)
//             }
//         }).catch(err=>{
//             console.log(err.response)
//         }).finally(() => {
//             setLoading(false)
//         });
//     }
//
//     const cartColor = (e) => {
//         setColor(e.target.value)
//     }
//     const cardDate = (e) => {
//         setDate(e.target.value)
//     }
//
//     const saveCard = () => {
//         setCardData({
//             color:color,
//             date:date,
//             text:text
//         })
//         dispatch({type:'NOTIFY',payload:state.notify.length > 0?[  {
//                 color:color,
//                 date:date,
//                 text:text
//             },...state.notify]:[  {
//                 color:color,
//                 date:date,
//                 text:text
//             }]})
//     }
//     useEffect(()=>{
//         getData()
//     },[])
//
//     return (
//         <>
//             <div className="header">
//                 <h1 className="header-title title_font">
//                     {translate('welcome',state.lang.code)} {state.user.name}!
//                 </h1>
//                 <p className="header-subtitle text_font">{translate('seeStatistics',state.lang.code)}</p>
//             </div>
//
//             {/* ===== Order Statistics Dashboard ===== */}
//             <OrderDashboardStats />
//
//             <div className="row">
//                 <div className="col-xl-6 col-xxl-7">
//                     <div className="card flex-fill w-100">
//                         <div className="card-header">
//                             <div className="card-actions float-end">
//                                 <a href="#" className="me-1">
//                                     <i className="align-middle" data-feather="refresh-cw"></i>
//                                 </a>
//                                 <div className="d-inline-block dropdown show">
//                                     <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
//                                         <i className="align-middle" data-feather="more-vertical"></i>
//                                     </a>
//                                     <div className="dropdown-menu dropdown-menu-end">
//                                         <a className="dropdown-item" href="#">Action</a>
//                                         <a className="dropdown-item" href="#">Another action</a>
//                                         <a className="dropdown-item" href="#">Something else here</a>
//                                     </div>
//                                 </div>
//                             </div>
//                             <h5 className="card-title mb-0">ჩანაწერების ბლოკონტი</h5>
//                         </div>
//                         <div className="card-body py-3">
//                             <div className="chart chart-sm">
//                                 <div className='col-xl-12 font_form_title' >
//                                     <TextField required onChange={(e)=>setText(e.target.value)} id="outlined-basic" fullWidth label="ჩანაწერი" variant="outlined" />
//                                 </div>
//                                 <div className='row pt-3'>
//                                     <div className='col-4 font_form_title'>
//                                         <TextField
//                                             size='small'
//                                             id="date"
//                                             label="თარიღი"
//                                             type="date"
//                                             defaultValue="2022-08-24"
//                                             sx={{ width: 220 }}
//                                             InputLabelProps={{
//                                                 shrink: true,
//                                             }}
//                                             onChange={cardDate}
//                                             required={'required'}
//                                         />
//                                     </div>
//                                     <div className='col-4 font_form_title'>
//                                         <input required onChange={cartColor} type='color' defaultValue='#6610f2' style={{borderRadius:'100%',border:'none',height:'100%'}}/>
//                                     </div>
//                                 </div>
//                                 <div className='mt-3'>
//                                     <Button className='font_form_title' disabled={text?false:true} onClick={()=>saveCard()} variant="contained">ბარათის შექმა</Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="col-xl-6 col-xxl-5 d-flex">
//                     <div className="w-100">
//                         <div className="row">
//                             <div className="col-sm-6">
//                                 <div className="card">
//                                     <div className="card-body">
//                                         <div className="row">
//                                             <div className="col mt-0">
//                                                 <h5 className="card-title">გვერდები</h5>
//                                             </div>
//                                             <div className="col-auto">
//                                                 <div className="avatar">
//                                                     <div className="avatar-title rounded-circle bg-primary-dark">
//                                                         <i className="align-middle fas fa-fw fa-file"></i>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <h1 className="display-5 mt-1 mb-3">{loading?'...':data.pages}</h1>
//                                     </div>
//                                 </div>
//                                 <div className="card">
//                                     <div className="card-body">
//                                         <div className="row">
//                                             <div className="col mt-0">
//                                                 <h5 className="card-title">მომხმარებლები</h5>
//                                             </div>
//                                             <div className="col-auto">
//                                                 <div className="avatar">
//                                                     <div className="avatar-title rounded-circle bg-primary-dark">
//                                                         <i className="align-middle fas fa-fw fa-users"></i>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <h1 className="display-5 mt-1 mb-3">{loading?'...':data.users}</h1>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-sm-6">
//                                 <div className="card">
//                                     <div className="card-body">
//                                         <div className="row">
//                                             <div className="col mt-0">
//                                                 <h5 className="card-title">კატეგორები</h5>
//                                             </div>
//                                             <div className="col-auto">
//                                                 <div className="avatar">
//                                                     <div className="avatar-title rounded-circle bg-primary-dark">
//                                                         <i className="align-middle fas fa-fw fa-book"></i>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <h1 className="display-5 mt-1 mb-3">{loading?'...':data.categories}</h1>
//                                     </div>
//                                 </div>
//                                 <div className="card">
//                                     <div className="card-body">
//                                         <div className="row">
//                                             <div className="col mt-0">
//                                                 <h5 className="card-title">ფაილები</h5>
//                                             </div>
//                                             <div className="col-auto">
//                                                 <div className="avatar">
//                                                     <div className="avatar-title rounded-circle bg-primary-dark">
//                                                         <i className="align-middle fas fa-fw fa-images"></i>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <h1 className="display-5 mt-1 mb-3">{loading?'...':data.files}</h1>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }
//
// export default HomePage;