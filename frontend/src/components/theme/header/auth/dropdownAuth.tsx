'use client';
import React, { useState } from 'react';
import Button from "@/components/ui/button/Button";
 import UserIcon from "@/assets/icons/menu/user.svg";
 import GoogleIcon from "@/assets/icons/auth/google.svg";
type Mode = 'login' | 'register';

const DropdownAuth: React.FC = () => {
    const [mode, setMode] = useState<Mode>('login');
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    return (
        <div className="auth-card position-relative text_font">
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
            <div className="auth-title text-center title_font_bold  mb-3">გაიარე ავტორიზაცია</div>

            {/* Tabs */}
            <div className="auth-tabs w-100 d-flex justify-content-between gap-2 mb-3" role="tablist" aria-label="Auth tabs">
                <button
                    type="button"
                    className={`auth-tab text_font btn btn-sm ${mode === 'login' ? 'btn-auth' : 'btn-outline-auth'}`}
                    onClick={() => setMode('login')}
                    aria-selected={mode === 'login'}
                >
                    ავტორიზაცია
                </button>
                <button
                    type="button"
                    className={`auth-tab text_font btn btn-sm ${mode === 'register' ? 'btn-auth' : 'btn-outline-auth'}`}
                    onClick={() => setMode('register')}
                    aria-selected={mode === 'register'}
                >
                    რეგისტრაცია
                </button>
            </div>

            {/* Login */}
            {mode === 'login' && (
                <form className="auth-form" autoComplete="on">
                    <div className="form-group has-right-icon mb-2">
                        <input
                            type="email"
                            className="form-control form-control-sm"
                            placeholder="ელ.ფოსტა"
                            required
                            inputMode="email"
                        />
                        <span className="right-icon bi bi-envelope"></span>
                    </div>

                    <div className="form-group has-right-icon mb-2">
                        <input
                            type={showPass ? 'text' : 'password'}
                            className="form-control form-control-sm"
                            placeholder="პაროლი"
                            required
                        />
                        <button
                            type="button"
                            className="right-icon btn-eye"
                            aria-label={showPass ? 'დამალვა' : 'ჩვენება'}
                            onClick={() => setShowPass(p => !p)}
                        >
                            <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>

                    <div className="text-center  align-items-center mb-2">
                        <a className="link-secondary text-center small" href="#">დაგავიწყდა პაროლი?</a>
                    </div>


                    <Button
                        className={'text-center  text_font d-flex justify-content-center'}
                        variant={'my-btn-blue'}
                        startIcon={<UserIcon />}
                        style={{width:'100%'}}
                    >შესვლა</Button>

                    <div className="auth-or my-2">ან</div>

                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-primary flex-fill google-button rounded-pill d-flex align-items-center justify-content-center gap-2">
                            <GoogleIcon/> Google
                        </button>
                        <button type="button" className="btn btn-primary flex-fill rounded-pill d-flex align-items-center justify-content-center gap-2">
                            <span className="bi bi-facebook"></span> Facebook
                        </button>
                    </div>
                </form>
            )}

            {/* Register */}
            {mode === 'register' && (
                <form className="auth-form" autoComplete="on">
                    <div className="form-group has-right-icon mb-2">
                        <input type="text" className="form-control form-control-sm" placeholder="სახელი, გვარი" required />
                        <span className="right-icon bi bi-person"></span>
                    </div>

                    <div className="form-group has-right-icon mb-2">
                        <input type="tel" className="form-control form-control-sm" placeholder="მობილური" inputMode="tel" />
                        <span className="right-icon bi bi-phone"></span>
                    </div>

                    <div className="form-group has-right-icon mb-2">
                        <input type="email" className="form-control form-control-sm" placeholder="ელ.ფოსტა" required />
                        <span className="right-icon bi bi-envelope"></span>
                    </div>

                    <div className="form-group has-right-icon mb-2">
                        <input
                            type={showPass ? 'text' : 'password'}
                            className="form-control form-control-sm"
                            placeholder="პაროლი"
                            required
                        />
                        <button
                            type="button"
                            className="right-icon btn-eye"
                            aria-label={showPass ? 'დამალვა' : 'ჩვენება'}
                            onClick={() => setShowPass(p => !p)}
                        >
                            <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>

                    <div className="form-group has-right-icon mb-2">
                        <input
                            type={showPass2 ? 'text' : 'password'}
                            className="form-control form-control-sm"
                            placeholder="გაიმეორე პაროლი"
                            required
                        />
                        <button
                            type="button"
                            className="right-icon btn-eye"
                            aria-label={showPass2 ? 'დამალვა' : 'ჩვენება'}
                            onClick={() => setShowPass2(p => !p)}
                        >
                            <i className={`bi ${showPass2 ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>

                    <div className="form-check mb-2 small">
                        <input className="form-check-input" type="checkbox" id="agree" defaultChecked />
                        <label className="form-check-label" htmlFor="agree">
                            ვეთანხმები მომსახურების პირობებს
                        </label>
                    </div>

                    <button type="submit" className="btn btn-auth w-100 mb-2">
                        <i className="bi bi-person-plus me-1"></i> ანგარიშის შექმნა
                    </button>

                    <div className="auth-or my-2">ან</div>

                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-light flex-fill border rounded-pill d-flex align-items-center justify-content-center gap-2">
                            <span className="bi bi-google"></span> Google
                        </button>
                        <button type="button" className="btn btn-primary flex-fill rounded-pill d-flex align-items-center justify-content-center gap-2">
                            <span className="bi bi-facebook"></span> Facebook
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default DropdownAuth;
