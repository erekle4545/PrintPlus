import React from 'react';
import Image from 'next/image';
import TrashIcon from '../../../../assets/icons/cart/trash.svg';
import Button from "@/components/ui/button/Button";

const DropdownCart = () => {

    return (
            <div className="position-relative">
                {/*  desktop */}
                    <div className="position-absolute top-0 start-50 translate-middle" style={{ marginTop: '-20px' }}>
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: '10px solid transparent',
                                borderRight: '10px solid transparent',
                                borderBottom: '10px solid white',
                            }}
                        />
                    </div>

                {/* X*/}
                <button
                    className="position-absolute cart-hover-panel-close-mob top-0 end-0 m-2 btn-close"
                    style={{ zIndex: 1060 }}
                    aria-label="Close"
                />

                {/* Header */}
                <div className="  text-black">
                    <h5 className="text-center title_font_bold m-0">ჩემი კალათა</h5>
                    <p className="text-center text_font m-1">მზა პროდუქცია</p>
                </div>


                <div className="d-flex flex-column gap-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="d-flex card-text-color gap-3 cart-dropdown-items-box pb-3 align-items-center">
                            <Image src="/assets/img/example/picture.jpg" width={60} height={60} alt="product" className="border rounded" />
                            <div className="flex-grow-1">
                                <div className="fw-bold">საკანცელარიო</div>
                                <div className="d-flex align-items-center gap-2 mt-1">
                                    <span className="fw-bold text-dark" style={{ fontSize: '16px' }}>10₾</span>
                                    <span className=" text-decoration-line-through cart-dropdown-min-sale-price " >30₾</span>
                                    <span className=" sale-cart-dropdown-product title_font  " >
                                      -30%
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column align-items-end justify-content-between">
                                <button className="bg-transparent border-0 p-0 mb-2">
                                    <TrashIcon />
                                </button>
                                <div className="quantity-selector d-flex align-items-center">
                                    <button className="quantity-btn">-</button>
                                    <span className="quantity-value">1</span>
                                    <button className="quantity-btn">+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-4 ">
                    <div className="d-flex justify-content-between  align-items-center  ">
                        <div className="col-xl-6">
                            <h3 className="  m-0" style={{ fontSize: '24px',color:'#232323' }}>სულ: 130₾</h3>
                        </div>
                        <div className="col-xl-6 d-flex justify-content-end gap-2">
                            <Button className="title_font fw-bolder" variant="my-btn-dark">ნახვა (7)</Button>
                            <Button className="title_font fw-bolder" variant="my-btn-blue">ყიდვა</Button>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default DropdownCart;
