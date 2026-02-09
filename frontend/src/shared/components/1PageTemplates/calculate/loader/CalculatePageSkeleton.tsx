'use client';

import React from 'react';
import './calculatePageSkeleton.css';

export default function CalculatePageSkeleton() {
    return (
        <div className="container py-4">
            {/* Header Title Skeleton */}
            <div className="skeleton-header  mb-4">
                <div className="skeleton-line m-auto skeleton-title" style={{ width: '300px', height: '32px' }}></div>

            </div>

            <div className='calculate-page-container'>
                {/* Calculator Title */}
                <div className="skeleton-line skeleton-subtitle mx-auto mb-4" style={{ width: '250px', height: '24px' }}></div>

                {/* Calculator Card */}
                <div className="calculate-card rounded-4 mb-4">
                    <div className="card-body p-4">
                        {/* Material Pills */}
                        <div className="d-flex gap-2 mb-4 flex-wrap">
                            <div className="skeleton-pill"></div>
                            <div className="skeleton-pill"></div>
                            <div className="skeleton-pill"></div>
                        </div>

                        {/* Sliders */}
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="skeleton-slider mb-2"></div>
                                <div className="skeleton-line" style={{ width: '200px', height: '16px' }}></div>
                            </div>
                            <div className="col-md-6">
                                <div className="skeleton-slider mb-2"></div>
                                <div className="skeleton-line" style={{ width: '200px', height: '16px' }}></div>
                            </div>
                        </div>

                        {/* Area calculation */}
                        <div className="text-center mt-3 mb-3">
                            <div className="skeleton-line mx-auto" style={{ width: '400px', height: '20px' }}></div>
                        </div>

                        {/* Extras checkboxes */}
                        <div className='d-flex justify-content-center'>
                            <div className="mt-3">
                                <div className="skeleton-checkbox mb-2"></div>
                                <div className="skeleton-checkbox mb-2"></div>
                                <div className="skeleton-checkbox mb-2"></div>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                            <div className="skeleton-line" style={{ width: '100px', height: '20px' }}></div>
                            <div className="skeleton-price-chip"></div>
                        </div>

                        {/* Bottom note */}
                        <div className="text-center mt-4">
                            <div className="skeleton-line mx-auto" style={{ width: '80%', height: '14px' }}></div>
                        </div>
                    </div>
                </div>

                {/* Price Table Title */}
                <div className="skeleton-line skeleton-subtitle mx-auto mb-3" style={{ width: '200px', height: '24px' }}></div>

                {/* Price Table */}
                <div className="table-responsive">
                    <div className="skeleton-table">
                        <div className="skeleton-table-header"></div>
                        <div className="skeleton-table-row"></div>
                        <div className="skeleton-table-row"></div>
                        <div className="skeleton-table-row"></div>
                    </div>
                </div>

                {/* Bottom Text Sections */}
                <div className="mt-4">
                    <div className="skeleton-line mb-2" style={{ width: '250px', height: '18px' }}></div>
                    <div className="skeleton-line mb-3" style={{ width: '100%', height: '14px' }}></div>
                    <div className="skeleton-line mb-3" style={{ width: '95%', height: '14px' }}></div>

                    <div className="skeleton-line mb-2" style={{ width: '280px', height: '18px' }}></div>
                    <div className="skeleton-line mb-3" style={{ width: '100%', height: '14px' }}></div>
                    <div className="skeleton-line mb-3" style={{ width: '90%', height: '14px' }}></div>

                    <div className="skeleton-line mb-2" style={{ width: '220px', height: '18px' }}></div>
                    <div className="skeleton-line mb-3" style={{ width: '100%', height: '14px' }}></div>
                    <div className="skeleton-line" style={{ width: '85%', height: '14px' }}></div>
                </div>
            </div>
        </div>
    );
}