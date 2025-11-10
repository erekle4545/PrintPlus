'use client';
import React from 'react';
import Button from "@/components/ui/button/Button";
import Cat1 from "../../../assets/icons/home/cat_1.svg"
import Cat2 from "../../../assets/icons/home/cat_2.svg"
import Cat3 from "../../../assets/icons/home/cat_3.svg"
const HomeCategories = () => {

    return (
        <div className="text-center my-5" >
            <h3 className="fw-bold mb-4" data-aos="zoom-in"	>როგორ ვმუშაობთ</h3>

            <div className="row justify-content-center g-3" data-aos="fade-up">
                {/* ბლოკი 1 */}
                <div className="col-12 col-md-4 col-xl-3" >
                    <div className="p-4 rounded-4" style={{ backgroundColor: '#F1CB44' }}>
                        <h5 className="fw-bold text-white mb-4 mt-3">დიზაინი</h5>
                        <div className="d-flex justify-content-center mb-3 ">
                            <div
                                className="d-flex col-xl-2 justify-content-center align-items-center"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    border: '3px dashed white',
                                }}
                            >
                                <Cat1/>
                                {/*<Image src="/icons/design-icon.svg" alt="დიზაინი" width={64} height={64} />*/}
                            </div>
                        </div>
                        <Button className="btn btn-white fw-bold mt-3 mb-3 " variant="my-btn-light">
                            სრულად →
                        </Button>
                    </div>
                </div>

                {/* ბლოკი 2 */}
                <div className="col-12 col-md-4 col-xl-3">
                    <div className="p-4 rounded-4" style={{ backgroundColor: '#D77BD9' }}>
                        <h5 className="fw-bold text-white mb-4 mt-3">ბეჭდვა</h5>
                        <div className="d-flex justify-content-center mb-3">
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    border: '3px dashed white',
                                }}
                            >
                                <Cat2/>

                            </div>
                        </div>
                        <Button className="btn btn-white fw-bold mt-3 mb-3 " variant="my-btn-light">
                            სრულად →
                        </Button>
                    </div>
                </div>

                {/* ბლოკი 3 */}
                <div className="col-12 col-md-4 col-xl-3">
                    <div className="p-4 rounded-4" style={{ backgroundColor: '#6E64D9' }}>
                        <h5 className="fw-bold text-white mb-4 mt-3">მიწოდება</h5>
                        <div className="d-flex justify-content-center mb-3">
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    border: '3px dashed white',
                                }}
                            >
                                <Cat3/>
                            </div>
                        </div>
                        <Button className="btn btn-white fw-bold mt-3 mb-3 " variant="my-btn-light">
                            სრულად →
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeCategories;