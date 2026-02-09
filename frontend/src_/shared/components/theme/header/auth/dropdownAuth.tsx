'use client';
import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from "@/shared/components/ui/button/Button";
import UserIcon from "@/shared/assets/icons/menu/user.svg";
import GoogleIcon from "@/shared/assets/icons/auth/google.svg";
import {AUTH_SUCCESS_ROUTES} from "@/shared/utils/mix";
import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";

type Mode = 'login' | 'register';

const DropdownAuth: React.FC = () => {
    const [mode, setMode] = useState<Mode>('login');
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    // Login states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginErrors, setLoginErrors] = useState<{ [key: string]: string[] }>({});

    // Register states
    const [registerName, setRegisterName] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordConfirmation, setRegisterPasswordConfirmation] = useState('');
    const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string[] }>({});
    const [agreedToTerms, setAgreedToTerms] = useState(true);

    const { login, register, socialLogin } = useAuth();
    const router = useRouter();

    const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginErrors({});

        const result = await login(loginEmail, loginPassword);

        if (result.success) {
            // Close dropdown and redirect
            router.push(AUTH_SUCCESS_ROUTES.user);
        } else {
            if (result.errors?.errors) {
                setLoginErrors(result.errors.errors);
            }
        }
    };

    const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegisterErrors({});

        if (!agreedToTerms) {
            setRegisterErrors({ terms: ['უნდა დაეთანხმოთ მომსახურების პირობებს'] });
            return;
        }

        const result = await register(
            registerName,
            registerEmail,
            registerPhone,
            registerPassword,
            registerPasswordConfirmation
        );

        if (result.success) {
            // Close dropdown and redirect
            router.push(AUTH_SUCCESS_ROUTES.user);
        } else {
            if (result.errors?.errors) {
                setRegisterErrors(result.errors.errors);
            }
        }
    };

    const handleSocialLogin = async (provider: 'facebook' | 'google') => {
        await socialLogin(provider);
    };

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
            <div className="auth-title text-center title_font_bold mb-3">გაიარე ავტორიზაცია</div>

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
                <form className="auth-form" autoComplete="on" onSubmit={handleLoginSubmit}>
                    {loginErrors.email && (
                        <div className="alert alert-danger alert-sm py-1 px-2 mb-2 small">
                            {loginErrors.email[0]}
                        </div>
                    )}

                    <div className="form-group has-right-icon mb-2">
                        <input
                            type="email"
                            className={`form-control form-control-md ${loginErrors.email ? 'is-invalid' : ''}`}
                            placeholder="ელ.ფოსტა"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            inputMode="email"
                        />
                        <span className="right-icon bi bi-envelope"></span>
                    </div>

                    <div className="form-group has-right-icon mb-2">
                        <input
                            type={showPass ? 'text' : 'password'}
                            className={`form-control form-control-md ${loginErrors.password ? 'is-invalid' : ''}`}
                            placeholder="პაროლი"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
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

                    {loginErrors.password && (
                        <div className="text-danger small mb-2">{loginErrors.password[0]}</div>
                    )}

                    <div className="text-center align-items-center mb-2">
                        <a className="link-secondary text-center small" href="#">დაგავიწყდა პაროლი?</a>
                    </div>

                    <Button
                        type="submit"
                        className={'text-center title_font fw-bolder d-flex justify-content-center'}
                        variant={'my-btn-blue'}
                        startIcon={<UserIcon />}
                        style={{ width: '100%' }}
                    >
                        შესვლა
                    </Button>

                    <div className="auth-or my-2">ან</div>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="btn btn-outline-primary flex-fill google-button rounded-pill d-flex align-items-center justify-content-center gap-2"
                        >
                            <GoogleIcon /> Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            className="btn btn-primary flex-fill rounded-pill d-flex align-items-center justify-content-center gap-2"
                        >
                            <span className="bi bi-facebook"></span> Facebook
                        </button>
                    </div>
                </form>
            )}

            {/* Register */}
            {mode === 'register' && (
                <form className="auth-form" autoComplete="on" onSubmit={handleRegisterSubmit}>
                    {registerErrors.name && (
                        <div className="text-danger small mb-1">{registerErrors.name[0]}</div>
                    )}
                    <div className="form-group has-right-icon mb-2">
                        <input
                            type="text"
                            className={`form-control form-control-md ${registerErrors.name ? 'is-invalid' : ''}`}
                            placeholder="სახელი, გვარი"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            required
                        />
                        <span className="right-icon bi bi-person"></span>
                    </div>

                    <div className="form-group has-right-icon mb-2">
                        <input
                            type="tel"
                            className="form-control form-control-md"
                            placeholder="მობილური"
                            value={registerPhone}
                            onChange={(e) => setRegisterPhone(e.target.value)}
                            inputMode="tel"
                        />
                        <span className="right-icon bi bi-phone"></span>
                    </div>

                    {registerErrors.email && (
                        <div className="text-danger small mb-1">{registerErrors.email[0]}</div>
                    )}
                    <div className="form-group has-right-icon mb-2">
                        <input
                            type="email"
                            className={`form-control form-control-md ${registerErrors.email ? 'is-invalid' : ''}`}
                            placeholder="ელ.ფოსტა"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                        />
                        <span className="right-icon bi bi-envelope"></span>
                    </div>

                    {registerErrors.password && (
                        <div className="text-danger small mb-1">{registerErrors.password[0]}</div>
                    )}
                    <div className="form-group has-right-icon mb-2">
                        <input
                            type={showPass ? 'text' : 'password'}
                            className={`form-control form-control-md ${registerErrors.password ? 'is-invalid' : ''}`}
                            placeholder="პაროლი"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
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
                            className="form-control form-control-md "
                            placeholder="გაიმეორე პაროლი"
                            value={registerPasswordConfirmation}
                            onChange={(e) => setRegisterPasswordConfirmation(e.target.value)}
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

                    {registerErrors.terms && (
                        <div className="text-danger small mb-1">{registerErrors.terms[0]}</div>
                    )}
                    <div className="p-1 mb-3 mt-3 small">

                        <TealCheckbox
                            label="ვეთანხმები მომსახურების პირობებს"
                            checked={agreedToTerms}

                            className={'p-0 '}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />

                    </div>

                    <Button
                        type="submit"
                        className={'text-center title_font fw-bolder d-flex justify-content-center'}
                        variant={'my-btn-blue'}
                        startIcon={<UserIcon />}
                        style={{ width: '100%' }}
                    >
                       ანგარიშის შექმნა
                    </Button>



                    <div className="auth-or my-2">ან</div>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="btn btn-outline-primary flex-fill google-button rounded-pill d-flex align-items-center justify-content-center gap-2"
                        >
                            <GoogleIcon /> Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            className="btn btn-primary flex-fill rounded-pill d-flex align-items-center justify-content-center gap-2"
                        >
                            <span className="bi bi-facebook"></span> Facebook
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default DropdownAuth;