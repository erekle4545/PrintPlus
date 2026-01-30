import React, {  useEffect, useState} from "react";

import useHttp from "../../store/hooks/http/useHttp";
import IconButton from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {deleteAlert, errorAlerts, successOrder} from "../../store/hooks/global/useAlert";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Pagination from '@mui/material/Pagination';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import toast from "react-hot-toast";
import OrderDetailsModal from "./orderDetailsModal.jsx";


const OrderList = () => {
    const http = useHttp();
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState({});
    const [paymentStatuses, setPaymentStatuses] = useState({});
    const [statistics, setStatistics] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    // Filters
    const [pagination, setPagination] = useState([]);
    const [postPagination, setPostPagination] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(''); // NEW
    const [searchQuery, setSearchQuery] = useState('');
    const [checkbox, setCheckbox] = useState([]);

    const [loading, setLoading] = useState({
        orderList: false,
        statusUpdate: false
    });

    // Fetch statuses
    const getStatuses = () => {
        http.get('admin/orders/config/statuses').then((response) => {
            if (response.status === 200 && response.data.success) {
                setStatuses(response.data.data);
            }
        }).catch(err => {
            console.log(err.response);
        });
    };

    // Fetch payment statuses (NEW)
    const getPaymentStatuses = () => {
        http.get('admin/orders/config/payment-statuses').then((response) => {
            if (response.status === 200 && response.data.success) {
                setPaymentStatuses(response.data.data);
            }
        }).catch(err => {
            console.log(err.response);
        });
    };

    // Fetch statistics
    const getStatistics = () => {
        http.get('admin/orders/statistics').then((response) => {
            if (response.status === 200 && response.data.success) {
                setStatistics(response.data.data);
            }
        }).catch(err => {
            console.log(err.response);
        });
    };

    // Fetch orders
    const getOrders = () => {
        setLoading({
            ...loading,
            orderList: true
        });

        http.get(`admin/orders?page=${postPagination}`, {
            params: {
                per_page: perPage,
                status: statusFilter || null,
                payment_status: paymentStatusFilter || null, // NEW
                search: searchQuery || null
            }
        }).then((response) => {
            if (response.status === 200 && response.data.success) {
                setOrders(response.data.data.data);
                setPagination(response.data.data);
            }
        }).catch(err => {
            console.log(err.response);
            errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
        }).finally(() => {
            setLoading({
                ...loading,
                orderList: false
            });
        });
    };

    // View order details
    const viewOrder = (orderId) => {
        http.get(`admin/orders/${orderId}`).then((response) => {
            if (response.status === 200 && response.data.success) {

                setSelectedOrder(response.data.data);
                setShowModal(true);
            }
        }).catch(err => {
            console.log(err.response);
            errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
        });
    };

    // Update order status
    const updateOrderStatus = (orderId, newStatus) => {
        setLoading({
            ...loading,
            statusUpdate: true
        });

        http.put(`admin/orders/${orderId}/status`, {
            status: newStatus
        }).then((response) => {
            if (response.status === 200 && response.data.success) {
                toast.success('შეკვეთა წარმატებით განახლდა');
                getOrders();
                getStatistics();
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder(response.data.data);
                }
            }
        }).catch(err => {
            console.log(err.response);
            errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
        }).finally(() => {
            setLoading({
                ...loading,
                statusUpdate: false
            });
        });
    };

    // Delete order
    const deleteOrder = (id) => {
        http.delete(`admin/orders/${id}`).then((response) => {
            if (response.status === 200 && response.data.success) {
                setOrders(orders.filter(e => e.id !== id));
                successOrder('წაიშალა','შეკვეთა წარმატებით წაიშალა');
                toast.success('შეკვეთა წარმატებით წაიშალა');
                getStatistics();
                setShowDeleteModal(false);
                setOrderToDelete(null);
            }
        }).catch(err => {
            console.log(err.response);
            errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
        });
    };

    // Get status badge color
    const getStatusColor = (statusKey) => {
        const status = statuses[statusKey];
        if (!status) return 'default';

        const colorMap = {
            'warning': 'warning',
            'info': 'info',
            'primary': 'primary',
            'success': 'success',
            'danger': 'error'
        };

        return colorMap[status.color] || 'default';
    };

    // Get payment status color (NEW)
    const getPaymentStatusColor = (statusKey) => {
        const status = paymentStatuses[statusKey];
        if (!status) return 'default';

        const colorMap = {
            'warning': 'warning',
            'info': 'info',
            'primary': 'primary',
            'success': 'success',
            'danger': 'error',
            'secondary': 'default'
        };

        return colorMap[status.color] || 'default';
    };

    // Get status label
    const getStatusLabel = (statusKey) => {
        return statuses[statusKey]?.name || statusKey;
    };

    // Get payment status label (NEW)
    const getPaymentStatusLabel = (statusKey) => {
        return paymentStatuses[statusKey]?.name || statusKey;
    };

    // Get status icon
    const getStatusIcon = (statusKey) => {
        return statuses[statusKey]?.icon || '';
    };

    // Get payment status icon (NEW)
    const getPaymentStatusIcon = (statusKey) => {
        return paymentStatuses[statusKey]?.icon || '';
    };

    // Handle filter change
    const handleChangeSelectStatus = (e) => {
        setStatusFilter(e.target.value);
        setPostPagination(1);
    };

    const handleChangeSelectPaymentStatus = (e) => {
        setPaymentStatusFilter(e.target.value);
        setPostPagination(1);
    };

    const handleChangeSearch = (e) => {
        setSearchQuery(e.target.value);
        setPostPagination(1);
    };

    const clear = () => {
        setSearchQuery('');
        setStatusFilter('');
        setPaymentStatusFilter('');
        setPostPagination(1);
    };

    // Pagination
    const handleChangePagination = (e, value) => {
        setPostPagination(value);
    };

    // Check for delete
    const checkedDelete = (e) => {
        if (e.target.checked === true) {
            setCheckbox([...checkbox, e.target.value]);
        } else {
            setCheckbox(checkbox.filter(item => item !== e.target.value));
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ka-GE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format price
    const formatPrice = (price) => {
        return `${parseFloat(price).toFixed(2)} ₾`;
    };

    // Table rows
    const tableRow = () => {
        return orders.map((order, index) => {
            return (
                <tr key={index} className={'text_font'}>
                    <th scope="row" className='text-center align-items-center'>{order.id}</th>
                    <td className='font-weight-bold'>{order.order_number}</td>
                    <td>{order.name}</td>
                    <td>{order.phone}</td>
                    <td>{order.city}</td>
                    <td>
                        <Chip
                            label={`${getStatusIcon(order.status)} ${getStatusLabel(order.status)}`}
                            color={getStatusColor(order.status)}
                            className={'text_font'}
                        />
                    </td>
                    <td>
                        <Chip
                            label={`${getPaymentStatusIcon(order.payment_status)} ${getPaymentStatusLabel(order.payment_status)}`}
                            color={getPaymentStatusColor(order.payment_status)}
                            className={'text_font'}
                        />
                    </td>
                    <td className='font-weight-bold'>{formatPrice(order.total)}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                        <div className='d-flex justify-content-end'>
                            <input
                                style={{marginRight: '1rem'}}
                                onChange={checkedDelete}
                                value={order.id}
                                type='checkbox'
                            />
                            <IconButton
                                variant="extended"
                                onClick={() => viewOrder(order.id)}
                                color={'primary'}
                                aria-label="view"
                            >
                                <VisibilityIcon />
                            </IconButton>
                            <IconButton
                                variant="extended"
                                onClick={() => {
                                    setOrderToDelete(order.id);
                                    setShowDeleteModal(true);
                                }}
                                color={'error'}
                                aria-label="delete"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </td>
                </tr>
            );
        });
    };

    // Statistics cards
    const StatisticsCard = () => {
        if (!Object.keys(statistics).length) return null;

        return (
            <div className="row mb-3 justify-content-center align-items-stretch">
                <div className="col-md-3">
                    <div className="card text-center h-100">
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title title_font">სულ შეკვეთები</h5>
                            <h2>{statistics.total_orders || 0}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center bg-success text-white h-100">
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">გადახდილი</h5>
                            <h2>{statistics.paid_orders_count || 0}</h2>
                            <p className="mb-0">{formatPrice(statistics.total_paid_amount || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center bg-warning text-white h-100">
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">მოლოდინში</h5>
                            <h2>{statistics.pending_payments_count || 0}</h2>
                            <p className="mb-0">{formatPrice(statistics.total_pending_payments || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center bg-info text-white h-100">
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">დაბრუნებული</h5>
                            <h2>{formatPrice(statistics.total_refunded_amount || 0)}</h2>
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    useEffect(() => {
        getOrders();
        getStatistics();
    }, [postPagination, statusFilter, paymentStatusFilter, searchQuery]);

    useEffect(() => {
        getStatuses();
        getPaymentStatuses();
    }, []);

    return (
        <>
            <div className="col-md-12 col-xl-12">
                <StatisticsCard />

                <div className="card bg-w">


                    <div className="row p-4 justify-content-between  text_font">
                        <div className="col-xl-3 col-sm-12 p-1">
                            <label htmlFor="search" className='pb-2 font_form_title font-weight-bold'>
                                ძებნა
                            </label>
                            <TextField
                                fullWidth
                                onChange={handleChangeSearch}
                                value={searchQuery}
                                label="ძებნა"
                                size='small'
                                id="search"
                            />
                        </div>

                        <div className="col-xl-2 col-sm-12 p-1">
                            <label htmlFor="order_status" className='pb-2 font_form_title font-weight-bold'>
                                შეკვეთის სტატუსი
                            </label>
                            <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
                                <Select
                                    id="order_status"
                                    value={statusFilter}
                                    onChange={handleChangeSelectStatus}
                                    displayEmpty
                                >
                                    <MenuItem value="">ყველა</MenuItem>
                                    {Object.entries(statuses).map(([key, status]) => (
                                        <MenuItem key={key} value={key}>
                                            {status.icon} {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-xl-2 col-sm-12 p-1">
                            <label htmlFor="payment_status" className='pb-2 font_form_title font-weight-bold'>
                                გადახდის სტატუსი
                            </label>
                            <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
                                <Select
                                    id="payment_status"
                                    value={paymentStatusFilter}
                                    onChange={handleChangeSelectPaymentStatus}
                                    displayEmpty
                                >
                                    <MenuItem value="">ყველა</MenuItem>
                                    {Object.entries(paymentStatuses).map(([key, status]) => (
                                        <MenuItem key={key} value={key}>
                                            {status.icon} {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-xl-2 col-sm-12 p-1">
                            <label htmlFor="per_page" className='pb-2 font_form_title font-weight-bold'>
                                ჩანაწერების რ-ბა
                            </label>
                            <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
                                <Select
                                    id="per_page"
                                    value={perPage}
                                    onChange={(e) => {
                                        setPerPage(e.target.value);
                                        setPostPagination(1);
                                    }}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-xl-2 col-sm-12 text-center p-1">
                            <div>
                                <label className='pb-2 font_form_title font-weight-bold'>
                                    გასუფთავება
                                </label>
                            </div>
                            <IconButton
                                onClick={clear}
                                color='secondary'
                                variant="contained"
                            >
                                <ClearIcon />Clear
                            </IconButton>
                        </div>
                    </div>

                    {loading.orderList ? (
                        <div className='text-center p-5'>
                            <CircularProgress />
                            <p>იტვირთება...</p>
                        </div>
                    ) : (
                        <div>
                            {orders.length > 0 ? (
                                <>
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                        <tr className={'title_font small'}>
                                            <th scope="col" className={'text-center'}>ID</th>
                                            <th scope="col">შეკვეთის #</th>
                                            <th scope="col">სახელი</th>
                                            <th scope="col">ტელეფონი</th>
                                            <th scope="col">ქალაქი</th>
                                            <th scope="col">შეკვეთის სტატუსი</th>
                                            <th scope="col">გადახდის სტატუსი</th>
                                            <th scope="col">ჯამი</th>
                                            <th scope="col">თარიღი</th>
                                            <th scope="col" className='text-end'>
                                                <IconButton
                                                    variant="extended"
                                                    onClick={() => {
                                                        deleteAlert(checkbox, deleteOrder);
                                                    }}
                                                    color={'error'}
                                                    aria-label="delete"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tableRow()}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <h6 className={'text-center text_font p-5'}>
                                    შეკვეთები არ არის...
                                </h6>
                            )}
                            <div className='col-12 p-4 d-flex justify-content-end'>
                                <Pagination
                                    count={pagination.last_page}
                                    page={postPagination}
                                    onChange={handleChangePagination}
                                    color="primary"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                open={showModal}
                onClose={() => setShowModal(false)}
                order={selectedOrder}
                statuses={statuses}
                onStatusUpdate={updateOrderStatus}
                loading={loading.statusUpdate}
            />

            {/* Delete Confirmation Modal */}
            <Dialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <DialogTitle>შეკვეთის წაშლა</DialogTitle>
                <DialogContent>
                    <p className="text_font">დარწმუნებული ხართ, რომ გსურთ ამ შეკვეთის წაშლა?</p>
                    <p className="text-danger text_font">ეს მოქმედება შეუქცევადია!</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowDeleteModal(false)}
                        color="primary"
                    >
                        გაუქმება
                    </Button>
                    <Button
                        onClick={() => deleteOrder(orderToDelete)}
                        color="error"
                        variant="contained"
                    >
                        წაშლა
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderList;
// import React, {  useEffect, useState} from "react";
//
// import useHttp from "../../store/hooks/http/useHttp";
// import IconButton from '@mui/material/Button';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ClearIcon from '@mui/icons-material/Clear';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import {deleteAlert, errorAlerts, successOrder} from "../../store/hooks/global/useAlert";
// import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Pagination from '@mui/material/Pagination';
// import CircularProgress from "@mui/material/CircularProgress";
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import Button from '@mui/material/Button';
// import Chip from '@mui/material/Chip';
// import toast from "react-hot-toast";
// import OrderDetailsModal from "./orderDetailsModal.jsx";
//
//
// const OrderList = () => {
//     const http = useHttp();
//     const [orders, setOrders] = useState([]);
//     const [statuses, setStatuses] = useState({});
//     const [statistics, setStatistics] = useState({});
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [orderToDelete, setOrderToDelete] = useState(null);
//
//     // Filters
//     const [pagination, setPagination] = useState([]);
//     const [postPagination, setPostPagination] = useState(1);
//     const [perPage, setPerPage] = useState(15);
//     const [statusFilter, setStatusFilter] = useState('');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [checkbox, setCheckbox] = useState([]);
//
//     const [loading, setLoading] = useState({
//         orderList: false,
//         statusUpdate: false
//     });
//
//     // Fetch statuses
//     const getStatuses = () => {
//         http.get('admin/orders/config/statuses').then((response) => {
//             if (response.status === 200 && response.data.success) {
//                 setStatuses(response.data.data);
//             }
//         }).catch(err => {
//             console.log(err.response);
//         });
//     };
//
//     // Fetch statistics
//     const getStatistics = () => {
//         http.get('admin/orders/statistics').then((response) => {
//             if (response.status === 200 && response.data.success) {
//                 setStatistics(response.data.data);
//             }
//         }).catch(err => {
//             console.log(err.response);
//         });
//     };
//
//     // Fetch orders
//     const getOrders = () => {
//         setLoading({
//             ...loading,
//             orderList: true
//         });
//
//         http.get(`admin/orders?page=${postPagination}`, {
//             params: {
//                 per_page: perPage,
//                 status: statusFilter || null,
//                 search: searchQuery || null
//             }
//         }).then((response) => {
//             if (response.status === 200 && response.data.success) {
//                 setOrders(response.data.data.data);
//                 setPagination(response.data.data);
//             }
//         }).catch(err => {
//             console.log(err.response);
//             errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
//         }).finally(() => {
//             setLoading({
//                 ...loading,
//                 orderList: false
//             });
//         });
//     };
//
//     // View order details
//     const viewOrder = (orderId) => {
//         http.get(`admin/orders/${orderId}`).then((response) => {
//             if (response.status === 200 && response.data.success) {
//                 setSelectedOrder(response.data.data);
//                 setShowModal(true);
//             }
//         }).catch(err => {
//             console.log(err.response);
//             errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
//         });
//     };
//
//     // Update order status
//     const updateOrderStatus = (orderId, newStatus) => {
//         setLoading({
//             ...loading,
//             statusUpdate: true
//         });
//
//         http.put(`admin/orders/${orderId}/status`, {
//             status: newStatus
//         }).then((response) => {
//             if (response.status === 200 && response.data.success) {
//                 toast.success('შეკვეთა წარმატებით განახლდა');
//                 getOrders();
//                 getStatistics();
//                 if (selectedOrder && selectedOrder.id === orderId) {
//                     setSelectedOrder(response.data.data);
//                 }
//             }
//         }).catch(err => {
//             console.log(err.response);
//             errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
//         }).finally(() => {
//             setLoading({
//                 ...loading,
//                 statusUpdate: false
//             });
//         });
//     };
//
//     // Delete order
//     const deleteOrder = (id) => {
//         http.delete(`admin/orders/${id}`).then((response) => {
//             if (response.status === 200 && response.data.success) {
//                 setOrders(orders.filter(e => e.id !== id));
//                 successOrder('წაიშალა','შეკვეთა წარმატებით წაიშალა');
//                 toast.success('შეკვეთა წარმატებით წაიშალა');
//                 getStatistics();
//                 setShowDeleteModal(false);
//                 setOrderToDelete(null);
//             }
//         }).catch(err => {
//             console.log(err.response);
//             errorAlerts(err.response?.status, err.response?.statusText, err.response?.data?.errors);
//         });
//     };
//
//     // Get status badge color
//     const getStatusColor = (statusKey) => {
//         const status = statuses[statusKey];
//         if (!status) return 'default';
//
//         const colorMap = {
//             'warning': 'warning',
//             'info': 'info',
//             'primary': 'primary',
//             'success': 'success',
//             'danger': 'error'
//         };
//
//         return colorMap[status.color] || 'default';
//     };
//
//     // Get status label
//     const getStatusLabel = (statusKey) => {
//         return statuses[statusKey]?.name || statusKey;
//     };
//
//     // Get status icon
//     const getStatusIcon = (statusKey) => {
//         return statuses[statusKey]?.icon || '';
//     };
//
//     // Handle filter change
//     const handleChangeSelectStatus = (e) => {
//         setStatusFilter(e.target.value);
//         setPostPagination(1);
//     };
//
//     const handleChangeSearch = (e) => {
//         setSearchQuery(e.target.value);
//         setPostPagination(1);
//     };
//
//     const clear = () => {
//         setSearchQuery('');
//         setStatusFilter('');
//         setPostPagination(1);
//     };
//
//     // Pagination
//     const handleChangePagination = (e, value) => {
//         setPostPagination(value);
//     };
//
//     // Check for delete
//     const checkedDelete = (e) => {
//         if (e.target.checked === true) {
//             setCheckbox([...checkbox, e.target.value]);
//         } else {
//             setCheckbox(checkbox.filter(item => item !== e.target.value));
//         }
//     };
//
//     // Format date
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('ka-GE', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };
//
//     // Format price
//     const formatPrice = (price) => {
//         return `${parseFloat(price).toFixed(2)} ₾`;
//     };
//
//     // Table rows
//     const tableRow = () => {
//         return orders.map((order, index) => {
//             return (
//                 <tr key={index} className={'text_font'}>
//                     <th scope="row" className='text-center align-items-center'>{order.id}</th>
//                     <td className='font-weight-bold'>{order.order_number}</td>
//                     <td>{order.name}</td>
//                     <td>{order.phone}</td>
//                     <td>{order.city}</td>
//                     <td>
//                         <Chip
//                             label={`${getStatusIcon(order.status)} ${getStatusLabel(order.status)}`}
//                             color={getStatusColor(order.status)}
//                             size="small"
//                         />
//                     </td>
//                     <td className='font-weight-bold'>{formatPrice(order.total)}</td>
//                     <td>{formatDate(order.created_at)}</td>
//                     <td>
//                         <div className='d-flex justify-content-end'>
//                             <input
//                                 style={{marginRight: '1rem'}}
//                                 onChange={checkedDelete}
//                                 value={order.id}
//                                 type='checkbox'
//                             />
//                             <IconButton
//                                 variant="extended"
//                                 onClick={() => viewOrder(order.id)}
//                                 color={'primary'}
//                                 aria-label="view"
//                             >
//                                 <VisibilityIcon />
//                             </IconButton>
//                             <IconButton
//                                 variant="extended"
//                                 onClick={() => {
//                                     setOrderToDelete(order.id);
//                                     setShowDeleteModal(true);
//                                 }}
//                                 color={'error'}
//                                 aria-label="delete"
//                             >
//                                 <DeleteIcon />
//                             </IconButton>
//                         </div>
//                     </td>
//                 </tr>
//             );
//         });
//     };
//
//     // Statistics cards
//     const StatisticsCard = () => {
//         if (!Object.keys(statistics).length) return null;
//
//         return (
//             <div className="row mb-4">
//                 <div className="col-md-3">
//                     <div className="card text-center">
//                         <div className="card-body">
//                             <h5 className="card-title title_font">სულ შეკვეთები</h5>
//                             <h2>{statistics.total_orders || 0}</h2>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card text-center bg-warning text-white">
//                         <div className="card-body">
//                             <h5 className="card-title">მოლოდინში</h5>
//                             <h2>{statistics.pending_orders || 0}</h2>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card text-center bg-success text-white">
//                         <div className="card-body">
//                             <h5 className="card-title">მიტანილი</h5>
//                             <h2>{statistics.delivered_orders || 0}</h2>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-md-3">
//                     <div className="card text-center bg-info text-white">
//                         <div className="card-body">
//                             <h5 className="card-title">შემოსავალი</h5>
//                             <h2>{formatPrice(statistics.total_revenue || 0)}</h2>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//     useEffect(() => {
//         getOrders();
//         getStatistics();
//     }, [postPagination, statusFilter, searchQuery]);
//
//     useEffect(() => {
//         getStatuses();
//     }, []);
//
//     return (
//         <>
//             <div className="col-md-12 col-xl-12">
//                 <StatisticsCard />
//
//                 <div className="card bg-w">
//                     <div className="card-header lite-background">
//                         <div className="row justify-content-between align-items-center">
//                             <div className="col-xl-6 col-sm-6 text-left">
//                                 <h5 className="card-title mb-0 p-2">
//                                     შეკვეთები
//                                 </h5>
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="tools-choose-config">
//                         <div className="col-xl-4 col-sm-12 p-1">
//                             <label htmlFor="search" className='pb-2 font_form_title font-weight-bold'>
//                                 ძებნა (ნომერი, სახელი, ტელეფონი)
//                             </label>
//                             <TextField
//                                 fullWidth
//                                 onChange={handleChangeSearch}
//                                 value={searchQuery}
//                                 label="ძებნა"
//                                 size='small'
//                                 id="search"
//                             />
//                         </div>
//
//                         <div className="col-xl-3 col-sm-12 p-1">
//                             <label htmlFor="order_status" className='pb-2 font_form_title font-weight-bold'>
//                                 სტატუსი
//                             </label>
//                             <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
//                                 <Select
//                                     id="order_status"
//                                     value={statusFilter}
//                                     onChange={handleChangeSelectStatus}
//                                     displayEmpty
//                                 >
//                                     <MenuItem value="">ყველა</MenuItem>
//                                     {Object.entries(statuses).map(([key, status]) => (
//                                         <MenuItem key={key} value={key}>
//                                             {status.icon} {status.name}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </div>
//
//                         <div className="col-xl-3 col-sm-12 p-1">
//                             <label htmlFor="per_page" className='pb-2 font_form_title font-weight-bold'>
//                                 ჩანაწერების რაოდენობა
//                             </label>
//                             <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
//                                 <Select
//                                     id="per_page"
//                                     value={perPage}
//                                     onChange={(e) => {
//                                         setPerPage(e.target.value);
//                                         setPostPagination(1);
//                                     }}
//                                 >
//                                     <MenuItem value={10}>10</MenuItem>
//                                     <MenuItem value={15}>15</MenuItem>
//                                     <MenuItem value={25}>25</MenuItem>
//                                     <MenuItem value={50}>50</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </div>
//
//                         <div className="col-xl-2 col-sm-12 text-center p-1">
//                             <div>
//                                 <label className='pb-2 font_form_title font-weight-bold'>
//                                     გასუფთავება
//                                 </label>
//                             </div>
//                             <IconButton
//                                 onClick={clear}
//                                 color='secondary'
//                                 variant="contained"
//                             >
//                                 <ClearIcon />Clear
//                             </IconButton>
//                         </div>
//                     </div>
//
//                     {loading.orderList ? (
//                         <div className='text-center p-5'>
//                             <CircularProgress />
//                             <p>იტვირთება...</p>
//                         </div>
//                     ) : (
//                         <div>
//                             {orders.length > 0 ? (
//                                 <>
//                                     <table className="table table-striped">
//                                         <thead>
//                                         <tr className={'title_font'}>
//                                             <th scope="col" className={'text-center'}># ID</th>
//                                             <th scope="col">შეკვეთის ნომერი</th>
//                                             <th scope="col">სახელი</th>
//                                             <th scope="col">ტელეფონი</th>
//                                             <th scope="col">ქალაქი</th>
//                                             <th scope="col">სტატუსი</th>
//                                             <th scope="col">ჯამი</th>
//                                             <th scope="col">თარიღი</th>
//                                             <th scope="col" className='text-end'>
//                                                 <IconButton
//                                                     variant="extended"
//                                                     onClick={() => {
//                                                         deleteAlert(checkbox, deleteOrder);
//                                                     }}
//                                                     color={'error'}
//                                                     aria-label="delete"
//                                                 >
//                                                     <DeleteIcon />
//                                                 </IconButton>
//                                             </th>
//                                         </tr>
//                                         </thead>
//                                         <tbody>
//                                         {tableRow()}
//                                         </tbody>
//                                     </table>
//                                 </>
//                             ) : (
//                                 <h6 className={'text-center text_font p-5'}>
//                                     შეკვეთები არ არის...
//                                 </h6>
//                             )}
//                             <div className='col-12 p-4 d-flex justify-content-end'>
//                                 <Pagination
//                                     count={pagination.last_page}
//                                     page={postPagination}
//                                     onChange={handleChangePagination}
//                                     color="primary"
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//
//             {/* Order Details Modal - ახლა ცალკე კომპონენტია */}
//             <OrderDetailsModal
//                 open={showModal}
//                 onClose={() => setShowModal(false)}
//                 order={selectedOrder}
//                 statuses={statuses}
//                 onStatusUpdate={updateOrderStatus}
//                 loading={loading.statusUpdate}
//             />
//
//             {/* Delete Confirmation Modal */}
//             <Dialog
//                 open={showDeleteModal}
//                 onClose={() => setShowDeleteModal(false)}
//             >
//                 <DialogTitle>შეკვეთის წაშლა</DialogTitle>
//                 <DialogContent>
//                     <p className="text_font">დარწმუნებული ხართ, რომ გსურთ ამ შეკვეთის წაშლა?</p>
//                     <p className="text-danger text_font">ეს მოქმედება შეუქცევადია!</p>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={() => setShowDeleteModal(false)}
//                         color="primary"
//                     >
//                         გაუქმება
//                     </Button>
//                     <Button
//                         onClick={() => deleteOrder(orderToDelete)}
//                         color="error"
//                         variant="contained"
//                     >
//                         წაშლა
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };
//
// export default OrderList;