// SliderSkeleton.tsx
'use client';

import React from 'react';
import './sliderSkeleton.css';

const SliderSkeleton = () => {
    return (
        <div className="container pb-1">
            <div className="position-relative">
                {/* Slider image skeleton */}
                <div className="slider-img-size skeleton-slider-image">
                    <div className="skeleton-shimmer"></div>
                </div>

                {/* Pagination dots skeleton */}
                <div className="custom-pagination d-flex gap-2 justify-content-center mt-3 mb-3">
                    <span className="skeleton-pagination-dot"></span>
                    <span className="skeleton-pagination-dot"></span>
                    <span className="skeleton-pagination-dot"></span>
                </div>
            </div>
        </div>
    );
};

export default SliderSkeleton;