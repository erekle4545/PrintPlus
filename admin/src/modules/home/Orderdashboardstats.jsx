import React, { useEffect, useState, useRef } from "react";
import useHttp from "../../store/hooks/http/useHttp";
import {Link} from "react-router-dom";

// Simple animated number component - only used AFTER data is loaded
const AnimatedNumber = ({ value, duration = 1500, decimals = 0 }) => {
    const [display, setDisplay] = useState(0);
    const animRef = useRef(null);
    const numValue = parseFloat(value) || 0;

    useEffect(() => {
        if (animRef.current) cancelAnimationFrame(animRef.current);

        if (numValue === 0) {
            setDisplay(0);
            return;
        }

        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(eased * numValue);
            if (progress < 1) {
                animRef.current = requestAnimationFrame(animate);
            } else {
                setDisplay(numValue);
            }
        };
        animRef.current = requestAnimationFrame(animate);

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [numValue, duration]);

    if (decimals > 0) {
        return <>{display.toFixed(decimals)}</>;
    }
    return <>{Math.round(display)}</>;
};

const OrderDashboardStats = () => {
    const http = useHttp();
    const [statistics, setStatistics] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [statuses, setStatuses] = useState({});
    const [loading, setLoading] = useState(true);

    const getStatistics = () => {
        http.get('admin/orders/statistics').then((response) => {
            if (response.status === 200 && response.data.success) {
                setStatistics(response.data.data);
            }
        }).catch(err => {
            console.log(err.response);
        }).finally(() => {
            setLoading(false);
        });
    };

    const getRecentOrders = () => {
        http.get('admin/orders', {
            params: { per_page: 5 }
        }).then((response) => {
            if (response.status === 200 && response.data.success) {
                setRecentOrders(response.data.data.data || []);
            }
        }).catch(err => {
            console.log(err.response);
        });
    };

    const getStatuses = () => {
        http.get('admin/orders/config/statuses').then((response) => {
            if (response.status === 200 && response.data.success) {
                setStatuses(response.data.data);
            }
        }).catch(err => {
            console.log(err.response);
        });
    };

    useEffect(() => {
        getStatistics();
        getRecentOrders();
        getStatuses();
    }, []);

    const formatPrice = (price) => {
        return parseFloat(price || 0).toFixed(2);
    };

    const getStatusLabel = (statusKey) => {
        return statuses[statusKey]?.name || statusKey;
    };

    const getStatusColorClass = (statusKey) => {
        const status = statuses[statusKey];
        if (!status) return 'badge-secondary';
        const map = {
            'warning': 'badge-warning',
            'info': 'badge-info',
            'primary': 'badge-primary',
            'success': 'badge-success',
            'danger': 'badge-danger'
        };
        return map[status.color] || 'badge-secondary';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ka-GE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="order-stats-loading">
                <style>{`
                    .order-stats-loading {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 3rem;
                    }
                    .stats-spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid #e9ecef;
                        border-top-color: #3B7DDD;
                        border-radius: 50%;
                        animation: stats-spin 0.8s linear infinite;
                    }
                    @keyframes stats-spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <div className="stats-spinner"></div>
            </div>
        );
    }

    if (!statistics) return null;

    // Parse all values safely (handles both strings like "87.00" and numbers like 1)
    const totalOrders = parseFloat(statistics.total_orders) || 0;
    const paidCount = parseFloat(statistics.paid_orders_count) || 0;
    const pendingCount = parseFloat(statistics.pending_payments_count) || 0;
    const paidAmount = parseFloat(statistics.total_paid_amount) || 0;
    const pendingAmount = parseFloat(statistics.total_pending_payments) || 0;
    const refundedAmount = parseFloat(statistics.total_refunded_amount) || 0;

    const paidPercent = totalOrders > 0 ? ((paidCount / totalOrders) * 100) : 0;
    const pendingPercent = totalOrders > 0 ? ((pendingCount / totalOrders) * 100) : 0;

    return (
        <>
            <style>{`
                .order-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                @media (max-width: 1200px) {
                    .order-stats-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 768px) {
                    .order-stats-grid { grid-template-columns: repeat(2, 1fr); }
                }

                .stat-card {
                    background: #fff;
                    border-radius: 8px;
                    padding: 1.25rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    border: 1px solid #e9ecef;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: stat-card-in 0.5s ease forwards;
                    transition: box-shadow 0.25s ease, transform 0.25s ease;
                }
                .stat-card:hover {
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                .stat-card:nth-child(1) { animation-delay: 0.05s; }
                .stat-card:nth-child(2) { animation-delay: 0.12s; }
                .stat-card:nth-child(3) { animation-delay: 0.19s; }
                .stat-card:nth-child(4) { animation-delay: 0.26s; }
                .stat-card:nth-child(5) { animation-delay: 0.33s; }
                .stat-card:nth-child(6) { animation-delay: 0.40s; }

                @keyframes stat-card-in {
                    to { opacity: 1; transform: translateY(0); }
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    border-radius: 8px 8px 0 0;
                }
                .stat-card.stat-total::before { background: #3B7DDD; }
                .stat-card.stat-paid::before { background: #28a745; }
                .stat-card.stat-pending::before { background: #ffc107; }
                .stat-card.stat-revenue::before { background: #17a2b8; }
                .stat-card.stat-pending-amount::before { background: #fd7e14; }
                .stat-card.stat-refunded::before { background: #6c757d; }

                .stat-card-icon {
                    width: 42px; height: 42px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.2rem;
                    margin-bottom: 0.75rem;
                    transition: transform 0.3s ease;
                }
                .stat-card:hover .stat-card-icon { transform: scale(1.1); }

                .stat-total .stat-card-icon { background: rgba(59,125,221,0.12); color: #3B7DDD; }
                .stat-paid .stat-card-icon { background: rgba(40,167,69,0.12); color: #28a745; }
                .stat-pending .stat-card-icon { background: rgba(255,193,7,0.12); color: #d4a017; }
                .stat-revenue .stat-card-icon { background: rgba(23,162,184,0.12); color: #17a2b8; }
                .stat-pending-amount .stat-card-icon { background: rgba(253,126,20,0.12); color: #fd7e14; }
                .stat-refunded .stat-card-icon { background: rgba(108,117,125,0.12); color: #6c757d; }

                .stat-card-label {
                    font-size: 0.8rem; color: #6c757d;
                    margin-bottom: 0.25rem; font-weight: 500;
                }
                .stat-card-value {
                    font-size: 1.6rem; font-weight: 700;
                    color: #212529; line-height: 1.2;
                }
                .stat-card-value .currency {
                    font-size: 0.9rem; font-weight: 500;
                    color: #6c757d; margin-left: 2px;
                }
                .stat-card-sub {
                    font-size: 0.75rem; color: #adb5bd; margin-top: 0.35rem;
                }

                .stat-progress-wrap {
                    margin-top: 0.5rem; height: 4px;
                    background: #e9ecef; border-radius: 2px; overflow: hidden;
                }
                .stat-progress-bar {
                    height: 100%; border-radius: 2px;
                    width: 0;
                    animation: progress-grow 1.5s ease 0.5s forwards;
                }
                .stat-progress-bar.green { background: #28a745; }
                .stat-progress-bar.yellow { background: #ffc107; }
                @keyframes progress-grow {
                    to { width: var(--progress-width); }
                }

                /* Recent Orders */
                .recent-orders-card {
                    background: #fff; border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    border: 1px solid #e9ecef;
                    overflow: hidden; margin-bottom: 1.5rem;
                    opacity: 0;
                    animation: stat-card-in 0.5s ease 0.5s forwards;
                }
                .recent-orders-header {
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid #e9ecef;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .recent-orders-header h6 { margin: 0; font-weight: 600; color: #212529; }
                .recent-orders-header a {
                    font-size: 0.8rem; color: #3B7DDD;
                    text-decoration: none; font-weight: 500;
                }
                .recent-orders-header a:hover { text-decoration: underline; }

                .recent-orders-table { width: 100%; border-collapse: collapse; }
                .recent-orders-table thead th {
                    padding: 0.6rem 1rem; font-size: 0.75rem;
                    text-transform: uppercase; color: #6c757d;
                    font-weight: 600; letter-spacing: 0.04em;
                    border-bottom: 1px solid #e9ecef; background: #f8f9fa;
                }
                .recent-orders-table tbody tr {
                    opacity: 0;
                    animation: row-fade-in 0.4s ease forwards;
                    transition: background 0.2s ease;
                }
                .recent-orders-table tbody tr:hover { background: #f8f9fa; }
                .recent-orders-table tbody tr:nth-child(1) { animation-delay: 0.6s; }
                .recent-orders-table tbody tr:nth-child(2) { animation-delay: 0.68s; }
                .recent-orders-table tbody tr:nth-child(3) { animation-delay: 0.76s; }
                .recent-orders-table tbody tr:nth-child(4) { animation-delay: 0.84s; }
                .recent-orders-table tbody tr:nth-child(5) { animation-delay: 0.92s; }

                @keyframes row-fade-in {
                    from { opacity: 0; transform: translateX(-8px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .recent-orders-table tbody td {
                    padding: 0.7rem 1rem; font-size: 0.85rem;
                    color: #495057; border-bottom: 1px solid #f1f3f5;
                    vertical-align: middle;
                }
                .order-number-cell { font-weight: 600; color: #3B7DDD; }

                .badge-status {
                    display: inline-block; padding: 0.25em 0.65em;
                    font-size: 0.72rem; font-weight: 600;
                    border-radius: 4px; line-height: 1; white-space: nowrap;
                }
                .badge-warning { background: rgba(255,193,7,0.15); color: #d4a017; }
                .badge-info { background: rgba(23,162,184,0.15); color: #138496; }
                .badge-primary { background: rgba(59,125,221,0.15); color: #3B7DDD; }
                .badge-success { background: rgba(40,167,69,0.15); color: #28a745; }
                .badge-danger { background: rgba(220,53,69,0.15); color: #dc3545; }
                .badge-secondary { background: rgba(108,117,125,0.15); color: #6c757d; }

                .price-cell { font-weight: 600; color: #212529; }
                .date-cell { color: #adb5bd; font-size: 0.8rem; }
                .no-orders-msg { padding: 2rem; text-align: center; color: #adb5bd; }
            `}</style>

            {/* Stats Grid */}
            <div className="order-stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-card-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="stat-card-label text_font">სულ შეკვეთები</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={totalOrders} />
                    </div>
                </div>

                <div className="stat-card stat-paid">
                    <div className="stat-card-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-card-label text_font">გადახდილი</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={paidCount} />
                    </div>
                    {totalOrders > 0 && (
                        <div className="stat-progress-wrap">
                            <div
                                className="stat-progress-bar green"
                                style={{ '--progress-width': `${paidPercent}%` }}
                            />
                        </div>
                    )}
                    <div className="stat-card-sub text_font">
                        {totalOrders > 0 ? `${paidPercent.toFixed(1)}% შეკვეთებიდან` : ''}
                    </div>
                </div>

                <div className="stat-card stat-pending">
                    <div className="stat-card-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-card-label text_font">მოლოდინში</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={pendingCount} />
                    </div>
                    {totalOrders > 0 && (
                        <div className="stat-progress-wrap">
                            <div
                                className="stat-progress-bar yellow"
                                style={{ '--progress-width': `${pendingPercent}%` }}
                            />
                        </div>
                    )}
                </div>

                <div className="stat-card stat-revenue">
                    <div className="stat-card-icon">
                        <i className="fas fa-wallet"></i>
                    </div>
                    <div className="stat-card-label text_font">გადახდილი თანხა</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={paidAmount} decimals={2} duration={2000} /><span className="currency">₾</span>
                    </div>
                </div>

                <div className="stat-card stat-pending-amount">
                    <div className="stat-card-icon">
                        <i className="fas fa-hourglass-half"></i>
                    </div>
                    <div className="stat-card-label text_font">მოლოდინში თანხა</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={pendingAmount} decimals={2} duration={2000} /><span className="currency">₾</span>
                    </div>
                </div>

                <div className="stat-card stat-refunded">
                    <div className="stat-card-icon">
                        <i className="fas fa-undo"></i>
                    </div>
                    <div className="stat-card-label text_font">დაბრუნებული</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={refundedAmount} decimals={2} duration={2000} /><span className="currency">₾</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="recent-orders-card">
                <div className="recent-orders-header">
                    <h6 className="title_font">ბოლო შეკვეთები</h6>
                    <Link to="/orders" className="text_font">ყველას ნახვა →</Link>
                </div>
                {recentOrders.length > 0 ? (
                    <table className="recent-orders-table">
                        <thead>
                        <tr>
                            <th className="text_font">შეკვეთის #</th>
                            <th className="text_font">კლიენტი</th>
                            <th className="text_font">სტატუსი</th>
                            <th className="text_font">ჯამი</th>
                            <th className="text_font">თარიღი</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrders.map((order, i) => (
                            <tr key={order.id || i}>
                                <td className="order-number-cell">{order.order_number}</td>
                                <td className="text_font">{order.name}</td>
                                <td>
                                        <span className={`badge-status text_font ${getStatusColorClass(order.status)}`}>
                                            {statuses[order.status]?.icon} {getStatusLabel(order.status)}
                                        </span>
                                </td>
                                <td className="price-cell">{formatPrice(order.total)} ₾</td>
                                <td className="date-cell text_font">{formatDate(order.created_at)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-orders-msg text_font">შეკვეთები ჯერ არ არის</div>
                )}
            </div>
        </>
    );
};

export default OrderDashboardStats;