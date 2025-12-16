'use client';

import Cover from "@/shared/components/theme/header/cover/cover";
import Image from "next/image";
import React, { useState } from "react";
import {  Form } from "react-bootstrap";
import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";
import Button from "@/shared/components/ui/button/Button";
import ShoppingBag from '@/shared/assets/icons/cart/shopping-bag-inside.svg';
import CheckIcon from '@/shared/assets/icons/check/check.svg';
import InfoIcon from '@/shared/assets/icons/info/info.svg';
import FileUploader from "@/shared/components/ui/uploader/FileUploader";
import OrderSidebar from "@/shared/components/ui/orderSidebar/OrderSidebar";

export default function BrandPage({ params }: { params: { slug: string } }) {
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [comment, setComment] = useState<string>("");

    const products = [
        { slug: "orange", name: "ბალიშის საფარი", img: "/assets/img/products/pro_1.png" },
        { slug: "green", name: "ბალიში ბაფთით", img: "/assets/img/products/pro_2.png" },
        { slug: "fur", name: "ბალიში ბეწვით", img: "/assets/img/example/picture.jpg" },
        { slug: "print", name: "ბალიში პრინტით", img: "/assets/img/products/pro_4.png" },
    ];

    const price = 120; // Demo

    const handleOrderClick = ()=>{
        //To Doo
    }

    return (
        <>
            <Cover />
            <div className="container py-4">
                <HeaderTitle title="ჩარჩოები" slug={[]} />
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-9  ">
                        <div className='section-brands p-4'>
                            <h5 className="mb-3 fw-bolder">აირჩიე მასალა</h5>
                            <div className="row">
                                {products.map((p) => {
                                    const isSelected = selectedProduct === p.slug;
                                    return (
                                        <div className="col-6 col-md-3 mb-4" key={p.slug}>
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setSelectedProduct(p.slug)}
                                                onKeyDown={(e) =>
                                                    (e.key === "Enter" || e.key === " ") && setSelectedProduct(p.slug)
                                                }
                                                className={`product-card text-center p-2  ${isSelected ? "is-selected" : ""}`}
                                                aria-pressed={isSelected}
                                            >
                                                {/* image wrapper keeps square ratio and crops nicely */}
                                                <div className="thumb">
                                                    <Image
                                                        src={p.img}
                                                        alt={p.name}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 25vw"
                                                        className="thumb-img"
                                                    />
                                                </div>

                                                {/* centered check badge */}
                                                {isSelected && (
                                                    <span className="selected-badge" aria-hidden="true">
                                                      <span className="badge-circle">
                                                       <CheckIcon/>
                                                      </span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* title */}
                                            <div className="mt-2 text-center fw-bolder">{p.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* method */}
                            <h5 className="mt-4 fw-bolder">აირჩიე ბალიშის მეთოდი</h5>
                            <TealCheckbox
                                label= {'სუბლიმაცია'}
                                // onChange={(e) =>  setSize(k)}
                            />
                            {/* qty */}
                            <h5 className="mt-4 fw-bolder">მოითხოვე რაოდენობა</h5>
                            <div className="d-flex align-items-center">
                                <button
                                    className={'btn btn-sm  btn-light qty-btn-item fw-bolder'}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="mx-1 qty-span-item">{quantity}</span>
                                <button
                                    className={'btn btn-sm btn-light qty-btn-item fw-bolder'}
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            {/*info*/}
                            <div className='mt-3 gap-2 text_font text-muted d-flex align-items-center align-content-center'>
                                <div>
                                     <InfoIcon/>
                                </div>
                                <div>
                                   1000-ზე მეტის შეკვეთის შემთხვევაში გთხოვთ დაგვიკავშირდეთ.
                                </div>
                            </div>
                            {/* comment */}
                            <h5 className="mt-4 fw-bolder">დამატებითი დეტალები</h5>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="შეკვეთასთან დაკავშირებული დამატებითი დეტალები მოგვწერეთ აქ"
                                value={comment}
                                className='text_font'
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <h5 className="mt-4 fw-bolder">ატვირთე ფაილი / ლოგო</h5>
                            <FileUploader
                                uploadUrl={`${process.env.NEXT_PUBLIC_API}/upload`}
                                headers={{ Authorization: `Bearer ` }}
                                accept="application/pdf,image/*"
                                multiple
                                maxSizeMB={50}
                                className={'text_font'}
                                autoUpload
                                onComplete={(items) => console.log("DONE", items)}
                                onError={(items) => console.log("ERR", items)}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-lg-3 mt-4 mt-lg-0 ">
                        <OrderSidebar
                            price={price}
                            quantity={quantity}
                            onOrderClick={handleOrderClick}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
