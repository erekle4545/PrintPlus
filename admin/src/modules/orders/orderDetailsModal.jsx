import React, {useRef, useState} from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PrintIcon from '@mui/icons-material/Print';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RefreshIcon from '@mui/icons-material/Refresh';
import UndoIcon from '@mui/icons-material/Undo';
import {FileEndpoint} from "@/common/envExtetions.js";
import CloseIcon from "@mui/icons-material/Close";
import Chip from '@mui/material/Chip';
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import useHttp from "../../store/hooks/http/useHttp";

const OrderDetailsModal = ({
                               open,
                               onClose,
                               order,
                               statuses,
                               onStatusUpdate,
                               loading,
                               onOrderUpdate
                           }) => {
    const printRef = useRef();
    const http = useHttp();

    const [checkingStatus, setCheckingStatus] = useState(false);
    const [refundLoading, setRefundLoading] = useState(false);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [selectedTransactionForRefund, setSelectedTransactionForRefund] = useState(null);
    const [statusCheckResult, setStatusCheckResult] = useState(null);

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

    const formatPrice = (price) => {
        return `${parseFloat(price).toFixed(2)} ₾`;
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            'pending': 'warning',
            'paid': 'success',
            'failed': 'error',
            'partially_refunded': 'info',
            'refunded': 'default',
        };
        return colors[status] || 'default';
    };

    const getTransactionStatusColor = (status) => {
        const colors = {
            'pending': 'warning',
            'processing': 'info',
            'completed': 'success',
            'failed': 'error',
            'cancelled': 'default',
        };
        return colors[status] || 'default';
    };

    // Check payment status
    const handleCheckPaymentStatus = async (transactionId) => {
        setCheckingStatus(true);
        setStatusCheckResult(null);
        try {
            const response = await http.post('admin/payment/check-status', {
                transaction_id: transactionId
            });
            if (response.data.success) {
                setStatusCheckResult({
                    type: 'success',
                    message: `სტატუსი: ${response.data.transaction.status}`,
                    data: response.data
                });
                if (onOrderUpdate) onOrderUpdate(order.id);
            } else {
                setStatusCheckResult({
                    type: 'error',
                    message: response.data.message || 'სტატუსის შემოწმება ვერ მოხერხდა'
                });
            }
        } catch (err) {
            setStatusCheckResult({
                type: 'error',
                message: err.response?.data?.message || 'შეცდომა სტატუსის შემოწმებისას'
            });
        } finally {
            setCheckingStatus(false);
        }
    };

    // Open refund dialog
    const handleOpenRefundDialog = (transaction) => {
        setSelectedTransactionForRefund(transaction);
        setRefundAmount(transaction.amount);
        setRefundReason('');
        setRefundDialogOpen(true);
    };

    // Process refund
    const handleRefund = async () => {
        if (!selectedTransactionForRefund) return;
        setRefundLoading(true);
        try {
            const response = await http.post('admin/payment/refund', {
                transaction_id: selectedTransactionForRefund.transaction_id,
                amount: parseFloat(refundAmount) || null,
                reason: refundReason || null
            });
            if (response.data.success) {
                setRefundDialogOpen(false);
                setSelectedTransactionForRefund(null);
                setRefundAmount('');
                setRefundReason('');
                if (onOrderUpdate) onOrderUpdate(order.id);
                alert('თანხა წარმატებით დაბრუნდა');
            } else {
                alert(response.data.message || 'რეფანდი ვერ განხორციელდა');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'შეცდომა რეფანდის დროს');
        } finally {
            setRefundLoading(false);
        }
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        const windowPrint = window.open('', '', 'width=900,height=650');

        windowPrint.document.write(`
            <html>
                <head>
                    <title>შეკვეთა - ${order.order_number}</title>
                    <style>
                        body { 
                            font-family: 'BPG Nino Mtavruli', Arial, sans-serif; 
                            padding: 20px;
                            color: #333;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #333;
                            padding-bottom: 10px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .section {
                            margin-bottom: 25px;
                            page-break-inside: avoid;
                        }
                        .section-title {
                            font-weight: bold;
                            font-size: 16px;
                            margin-bottom: 10px;
                            border-bottom: 2px solid #333;
                            padding-bottom: 5px;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 10px;
                        }
                        .info-item {
                            margin-bottom: 8px;
                        }
                        .info-label {
                            font-weight: bold;
                            display: inline-block;
                            min-width: 120px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 10px;
                        }
                        table, th, td {
                            border: 1px solid #333;
                        }
                        th, td {
                            padding: 10px;
                            text-align: left;
                        }
                        th {
                            background-color: #f5f5f5;
                            font-weight: bold;
                        }
                        .total-row {
                            font-weight: bold;
                            font-size: 16px;
                            background-color: #f9f9f9;
                        }
                        .item-details {
                            font-size: 12px;
                            color: #666;
                            margin-top: 5px;
                        }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);

        windowPrint.document.close();
        windowPrint.focus();
        setTimeout(() => {
            windowPrint.print();
            windowPrint.close();
        }, 250);
    };

    if (!order) return null;

    const paymentDetails = order.payment_details || {};

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xl"
                fullWidth
                PaperProps={{
                    style: {
                        minHeight: '90vh',
                    }
                }}
            >
                <DialogTitle className="title_font bg-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>შეკვეთის დეტალები - {order.order_number}</span>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            size="small"
                            className={'title_font'}
                        >
                            ბეჭდვა
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div ref={printRef}>
                        {/* Print Header */}
                        <div className="header" style={{display: 'none'}}>
                            <h1>შეკვეთა #{order.order_number}</h1>
                            <p>თარიღი: {formatDate(order.created_at)}</p>
                        </div>

                        {/* Payment Information Section */}
                        <div className="mb-4 no-print">
                            <h6 className="font-weight-bold mb-3 title_font" style={{
                                borderBottom: '2px solid #dee2e6',
                                paddingBottom: '10px'
                            }}>
                                <PaymentIcon style={{verticalAlign: 'middle', marginRight: '5px'}} />
                                გადახდის ინფორმაცია
                            </h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <div style={{
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #dee2e6'
                                    }}>
                                        <div className="mb-3">
                                            <span className="text_font fw-bolder">გადახდის სტატუსი:</span>{' '}
                                            <Chip
                                                label={paymentDetails.payment_status_label}
                                                color={getPaymentStatusColor(paymentDetails.payment_status)}
                                                size="small"
                                                style={{marginLeft: '10px'}}
                                            />
                                        </div>
                                        <div className="mb-2 text_font">
                                            <span className="fw-bolder">გადახდის მეთოდი:</span>{' '}
                                            {paymentDetails.payment_method_icon} {paymentDetails.payment_method_name}
                                        </div>
                                        {paymentDetails.paid_at && (
                                            <div className="mb-2 text_font">
                                                <span className="fw-bolder">გადახდის თარიღი:</span>{' '}
                                                {formatDate(paymentDetails.paid_at)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #dee2e6'
                                    }}>
                                        <div className="mb-2 text_font">
                                            <span className="fw-bolder">სრული თანხა:</span>{' '}
                                            <span className="h5">{formatPrice(paymentDetails.total_amount)}</span>
                                        </div>
                                        <div className="mb-2 text_font">
                                            <span className="fw-bolder">გადახდილი:</span>{' '}
                                            <span className="text-success fw-bold">
                                                {formatPrice(paymentDetails.paid_amount)}
                                            </span>
                                        </div>
                                        {paymentDetails.refunded_amount > 0 && (
                                            <div className="mb-2 text_font">
                                                <span className="fw-bolder">დაბრუნებული:</span>{' '}
                                                <span className="text-danger fw-bold">
                                                    {formatPrice(paymentDetails.refunded_amount)}
                                                </span>
                                            </div>
                                        )}
                                        {paymentDetails.remaining_amount > 0 && (
                                            <div className="mb-2 text_font">
                                                <span className="fw-bolder">დარჩენილი:</span>{' '}
                                                <span className="text-warning fw-bold">
                                                    {formatPrice(paymentDetails.remaining_amount)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status Check Result */}
                            {statusCheckResult && (
                                <div className={`mt-3 p-3 rounded ${statusCheckResult.type === 'success' ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'}`}>
                                    <span className={`text_font fw-bold ${statusCheckResult.type === 'success' ? 'text-success' : 'text-danger'}`}>
                                        {statusCheckResult.message}
                                    </span>
                                    {statusCheckResult.data && (
                                        <div className="mt-2 text_font" style={{fontSize: '12px'}}>
                                            <div>ტრანზაქცია: {statusCheckResult.data.transaction?.id}</div>
                                            <div>თანხა: {formatPrice(statusCheckResult.data.transaction?.amount)}</div>
                                            {statusCheckResult.data.transaction?.completed_at && (
                                                <div>დასრულდა: {formatDate(statusCheckResult.data.transaction.completed_at)}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Transaction History */}
                            {order.transactions_details && order.transactions_details.length > 0 && (
                                <div className="mt-4">
                                    <h6 className="font-weight-bold mb-3 text_font" style={{fontSize: '14px'}}>
                                        <AccountBalanceIcon style={{verticalAlign: 'middle', marginRight: '5px', fontSize: '18px'}} />
                                        ტრანზაქციების ისტორია ({paymentDetails.transactions_count})
                                    </h6>
                                    <div style={{
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '8px'
                                    }}>
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light" style={{position: 'sticky', top: 0}}>
                                            <tr className="text_font" style={{fontSize: '12px'}}>
                                                <th>ID</th>
                                                <th>ტიპი</th>
                                                <th>თანხა</th>
                                                <th>სტატუსი</th>
                                                <th>თარიღი</th>
                                                <th>აღწერა</th>
                                                <th className="text-center">მოქმედებები</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {order.transactions_details.map((transaction, idx) => (
                                                <tr key={idx} className="text_font" style={{fontSize: '12px'}}>
                                                    <td>
                                                        <small className="font-monospace">
                                                            {transaction.transaction_id}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <Chip
                                                            label={transaction.type === 'payment' ? 'გადახდა' : 'დაბრუნება'}
                                                            size="small"
                                                            color={transaction.type === 'payment' ? 'primary' : 'default'}
                                                            style={{fontSize: '10px', height: '20px'}}
                                                        />
                                                    </td>
                                                    <td className="fw-bold">
                                                        {formatPrice(transaction.amount)}
                                                    </td>
                                                    <td>
                                                        <Chip
                                                            label={transaction.status}
                                                            size="small"
                                                            color={getTransactionStatusColor(transaction.status)}
                                                            style={{fontSize: '10px', height: '20px'}}
                                                        />
                                                    </td>
                                                    <td>
                                                        {transaction.completed_at
                                                            ? formatDate(transaction.completed_at)
                                                            : formatDate(transaction.initiated_at)
                                                        }
                                                    </td>
                                                    <td>
                                                        <small>{transaction.description}</small>
                                                        {transaction.error_message && (
                                                            <div className="text-danger" style={{fontSize: '10px'}}>
                                                                {transaction.error_message}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex gap-1 justify-content-center flex-wrap">
                                                            {/* Check Status - pending/processing transactions */}
                                                            {(transaction.status === 'pending' || transaction.status === 'processing') && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="info"
                                                                    onClick={() => handleCheckPaymentStatus(transaction.transaction_id)}
                                                                    disabled={checkingStatus}
                                                                    style={{fontSize: '10px', minWidth: 'auto', padding: '2px 8px'}}
                                                                    title="სტატუსის შემოწმება"
                                                                >
                                                                    {checkingStatus ? <CircularProgress size={14} /> : <RefreshIcon style={{fontSize: '16px'}} />}
                                                                </Button>
                                                            )}
                                                            {/* Refund - completed payment transactions */}
                                                            {transaction.type === 'payment' && transaction.status === 'completed' && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="warning"
                                                                    onClick={() => handleOpenRefundDialog(transaction)}
                                                                    style={{fontSize: '10px', minWidth: 'auto', padding: '2px 8px'}}
                                                                    title="თანხის დაბრუნება"
                                                                >
                                                                    <UndoIcon style={{fontSize: '16px'}} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Customer Information */}
                        <div className="mb-4">
                            <h6 className="font-weight-bold mb-3 title_font" style={{
                                borderBottom: '2px solid #dee2e6',
                                paddingBottom: '10px'
                            }}>
                                მომხმარებლის ინფორმაცია
                            </h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>სახელი:</span> {order.name}
                                    </p>
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>ტელეფონი:</span> {order.phone}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>მისამართი:</span> {order.address}
                                    </p>
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>ქალაქი:</span> {order.city}
                                    </p>

                                    {order.latitude && order.longitude && (<>
                                            <p className="text_font mb-2">
                                                <span className={'fw-bolder'}>კორდინატები:</span> latitude: {order.latitude} / longitude: {order.longitude}
                                            </p>
                                            <p className="text_font mb-2">
                                                <a
                                                    href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="fw-bolder text-primary text-decoration-none"
                                                >
                                                    📍 რუკაზე ნახვა
                                                </a>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {order.notes && (
                                <p className="text_font mb-2 mt-3">
                                    <strong>შენიშვნა:</strong> {order.notes}
                                </p>
                            )}
                        </div>

                        {/* Order Information */}
                        <div className="mb-4">
                            <h6 className="font-weight-bold mb-3 title_font" style={{
                                borderBottom: '2px solid #dee2e6',
                                paddingBottom: '10px'
                            }}>
                                შეკვეთის ინფორმაცია
                            </h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>შეკვეთის ნომერი:</span> {order.order_number}
                                    </p>
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>თარიღი:</span> {formatDate(order.created_at)}
                                    </p>
                                    <div className="text_font mb-2 no-print">
                                        <span className={'fw-bolder'}>სტატუსი:</span>{' '}
                                        <FormControl size="small" sx={{minWidth: 200, ml: 2}}>
                                            <Select
                                                value={order.status}
                                                onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                                                disabled={loading}
                                            >
                                                {Object.entries(statuses).map(([key, status]) => (
                                                    <MenuItem key={key} value={key}>
                                                        {status.icon} {status.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <p className="text_font mb-2" style={{display: 'none'}}>
                                        <span className={'fw-bolder'}>სტატუსი:</span> {statuses[order.status]?.name || order.status}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>გადახდის მეთოდი:</span> {order.payment_method}
                                    </p>
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>ქვეჯამი:</span> {formatPrice(order.subtotal)}
                                    </p>
                                    <p className="text_font mb-2">
                                        <span className={'fw-bolder'}>მიწოდება:</span> {formatPrice(order.delivery_cost)}
                                    </p>
                                    <p className="h5 text_font mb-0" style={{
                                        padding: '10px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '5px',
                                        marginTop: '10px'
                                    }}>
                                        <span className={'fw-bolder'}>სულ:</span> {formatPrice(order.total)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-4">
                            <h6 className="font-weight-bold mb-3 title_font" style={{
                                borderBottom: '2px solid #dee2e6',
                                paddingBottom: '10px'
                            }}>
                                პროდუქტები
                            </h6>
                            <table className="table table-bordered">
                                <thead className="table-light">
                                <tr className="title_font">
                                    <th style={{width: '40%'}}>პროდუქტი</th>
                                    <th style={{width: '15%'}}>ფასი</th>
                                    <th style={{width: '15%'}}>რაოდენობა</th>
                                    <th style={{width: '15%'}}>ჯამი</th>
                                    <th className="no-print" style={{width: '15%'}}>ფაილები</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.items && order.items.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr className="text_font">
                                            <td>
                                                <div className="mb-2">
                                                    <strong>{item.name}</strong>
                                                </div>
                                                {item.color && (
                                                    <div className="mb-1">
                                                        <small style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            backgroundColor: '#e9ecef',
                                                            borderRadius: '3px',
                                                            marginRight: '5px'
                                                        }}>
                                                            ფერი: {item.color}
                                                        </small>
                                                    </div>
                                                )}
                                                {item.size && (
                                                    <div className="mb-1 fw-bolder">
                                                        <small style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            backgroundColor: '#e9ecef',
                                                            borderRadius: '3px',
                                                            marginRight: '5px'
                                                        }}>
                                                            ზომა: {item.size}
                                                        </small>
                                                    </div>
                                                )}
                                                {item.print_type && (
                                                    <div className="mb-1 fw-bolder">
                                                        <small style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            backgroundColor: '#e9ecef',
                                                            borderRadius: '3px',
                                                            marginRight: '5px'
                                                        }}>
                                                            ბეჭდვის ტიპი: {item.print_type}
                                                        </small>
                                                    </div>
                                                )}
                                                {item.materials && (
                                                    <div className="mb-1 fw-bolder">
                                                        <small style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            backgroundColor: '#d1ecf1',
                                                            borderRadius: '3px',
                                                            marginRight: '5px'
                                                        }}>
                                                            მასალა: {JSON.stringify(item.materials)}
                                                        </small>
                                                    </div>
                                                )}
                                                {item.extras && (
                                                    <div className="mb-1 fw-bolder">
                                                        <small style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            backgroundColor: '#d4edda',
                                                            borderRadius: '3px',
                                                            marginRight: '5px'
                                                        }}>
                                                            დამატებითი: {JSON.parse(item.extras)?.map((extra, idx) => {
                                                            return <React.Fragment key={idx}>
                                                                {extra} <br/>
                                                            </React.Fragment>
                                                        })}
                                                        </small>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text_font">{formatPrice(item.price)}</td>
                                            <td className="text_font text-center">{item.quantity}</td>
                                            <td className="text_font font-weight-bold">
                                                {formatPrice(item.price * item.quantity)}
                                            </td>

                                            <td className="no-print">
                                                {item.covers && item.covers.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {item.covers.map((cover, idx) => (
                                                            <div key={idx} style={{
                                                                position: 'relative',
                                                                display: 'inline-block'
                                                            }}>

                                                                <a
                                                                    href={FileEndpoint + '/' + cover.path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        display: 'block',
                                                                        border: '2px solid #dee2e6',
                                                                        borderRadius: '8px',
                                                                        overflow: 'hidden',
                                                                        transition: 'all 0.3s',
                                                                        position: 'relative'
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        e.currentTarget.style.border = '2px solid #007bff';
                                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,123,255,0.3)';
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        e.currentTarget.style.border = '2px solid #dee2e6';
                                                                        e.currentTarget.style.boxShadow = 'none';
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={FileEndpoint + '/' + cover.output_path}
                                                                        alt={`ფაილი ${idx + 1}`}
                                                                        style={{
                                                                            width: '80px',
                                                                            height: '80px',
                                                                            objectFit: 'cover',
                                                                            display: 'block'
                                                                        }}
                                                                    />

                                                                    <div style={{
                                                                        position: 'absolute',
                                                                        bottom: '0',
                                                                        left: '0',
                                                                        right: '0',
                                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                                        color: 'white',
                                                                        padding: '2px 5px',
                                                                        fontSize: '10px',
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        #{idx + 1}
                                                                    </div>

                                                                </a>
                                                                <div className={''}>
                                                                    რაოდენობა:  {cover.quantity}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted text_font">
                                                        <small>ფაილები არ არის</small>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="table-light">
                                    <td colSpan="3" className="text-right title_font">
                                        <strong>ქვეჯამი:</strong>
                                    </td>
                                    <td className="text_font font-weight-bold" colSpan="2">
                                        {formatPrice(order.subtotal)}
                                    </td>
                                </tr>
                                <tr className="table-light">
                                    <td colSpan="3" className="text-right title_font">
                                        <strong>მიწოდება:</strong>
                                    </td>
                                    <td className="text_font font-weight-bold" colSpan="2">
                                        {formatPrice(order.delivery_cost)}
                                    </td>
                                </tr>
                                <tr className="table-success">
                                    <td colSpan="3" className="text-right title_font">
                                        <span className={'fw-bolder'}>სულ:</span>
                                    </td>
                                    <td className="text_font fw-bolder" colSpan="2">
                                        <strong style={{fontSize: '18px'}}>
                                            {formatPrice(order.total)}
                                        </strong>
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Attached Files Summary */}
                        {order.items && order.items.some(item => item.covers && item.covers.length > 0) && (
                            <div className="mb-4 no-print">
                                <h6 className="font-weight-bold mb-3 title_font" style={{
                                    borderBottom: '2px solid #dee2e6',
                                    paddingBottom: '10px'
                                }}>
                                    <AttachFileIcon style={{verticalAlign: 'middle', marginRight: '5px'}} />
                                    მიმაგრებული ფაილები
                                </h6>
                                <div className="row">
                                    {order.items.map((item, itemIdx) => (
                                        item.covers && item.covers.length > 0 && (
                                            <div key={itemIdx} className="col-md-12 mb-3">
                                                <div style={{
                                                    padding: '15px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    border: '1px solid #dee2e6'
                                                }}>
                                                    <div className="text_font font-weight-bold mb-2">
                                                        {item.name}
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-3">
                                                        {item.covers.map((cover, idx) => (
                                                            <div key={idx} style={{
                                                                border: '2px solid #dee2e6',
                                                                borderRadius: '8px',
                                                                padding: '10px',
                                                                backgroundColor: 'white',
                                                                textAlign: 'center'
                                                            }}>
                                                                <a
                                                                    href={FileEndpoint + '/' + cover.path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        display: 'block',
                                                                        textDecoration: 'none'
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={FileEndpoint + '/' + cover.path}
                                                                        alt={`ფაილი ${idx + 1}`}
                                                                        style={{
                                                                            width: '150px',
                                                                            height: '150px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '5px',
                                                                            marginBottom: '8px'
                                                                        }}
                                                                    />
                                                                    <div className="text_font" style={{
                                                                        fontSize: '12px',
                                                                        color: '#6c757d'
                                                                    }}>
                                                                        ფაილი #{idx + 1}
                                                                    </div>
                                                                    <div className={''}>
                                                                        რაოდენობა:  {cover.quantity}
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
                <DialogActions className={'bg-body'}>
                    <Button onClick={onClose} variant='contained' className={'title_font'} color="inherit">
                        <CloseIcon/> დახურვა
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Refund Dialog */}
            <Dialog
                open={refundDialogOpen}
                onClose={() => setRefundDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className="title_font">
                    <UndoIcon style={{verticalAlign: 'middle', marginRight: '8px'}} />
                    თანხის დაბრუნება
                </DialogTitle>
                <DialogContent>
                    {selectedTransactionForRefund && (
                        <div className="mt-2">
                            <div className="mb-3 p-3" style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #dee2e6'
                            }}>
                                <div className="text_font mb-1">
                                    <span className="fw-bolder">ტრანზაქცია:</span>{' '}
                                    <span className="font-monospace">{selectedTransactionForRefund.transaction_id}</span>
                                </div>
                                <div className="text_font mb-1">
                                    <span className="fw-bolder">გადახდილი თანხა:</span>{' '}
                                    {formatPrice(selectedTransactionForRefund.amount)}
                                </div>
                            </div>

                            <TextField
                                fullWidth
                                label="დასაბრუნებელი თანხა"
                                type="number"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                size="small"
                                className="mb-3"
                                inputProps={{
                                    min: 0.01,
                                    max: selectedTransactionForRefund.amount,
                                    step: 0.01
                                }}
                                helperText={`მაქსიმუმ: ${formatPrice(selectedTransactionForRefund.amount)}`}
                            />

                            <TextField
                                fullWidth
                                label="მიზეზი (არასავალდებულო)"
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                size="small"
                                multiline
                                rows={2}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setRefundDialogOpen(false)}
                        color="inherit"
                        className="title_font"
                    >
                        გაუქმება
                    </Button>
                    <Button
                        onClick={handleRefund}
                        variant="contained"
                        color="warning"
                        disabled={refundLoading || !refundAmount || parseFloat(refundAmount) <= 0}
                        className="title_font"
                        startIcon={refundLoading ? <CircularProgress size={16} /> : <UndoIcon />}
                    >
                        {refundLoading ? 'მიმდინარეობს...' : 'თანხის დაბრუნება'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderDetailsModal;