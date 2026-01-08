'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_SUCCESS_ROUTES } from "@/shared/utils/mix";
import Button from "@/shared/components/ui/button/Button";
import UserIcon from "@/shared/assets/icons/menu/user.svg";
import GoogleIcon from "@/shared/assets/icons/auth/google_page.svg";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";
import {useLanguage} from "@/context/LanguageContext";
import CustomLoader from "@/shared/components/ui/loader/customLoader";
import {Alert} from "@/shared/components/ui/alert/alert";
import {useCart} from "@/shared/hooks/useCart";

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [generalError, setGeneralError] = useState<string>('');
    const {t} = useLanguage();
    const { login, socialLogin, user, loading } = useAuth();
    const { mergeGuestCart, refreshCart } = useCart();

    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    // Redirect to dashboard if user is already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push(AUTH_SUCCESS_ROUTES.user);
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');

        const result = await login(email, password);

        if (result.success) {
            await mergeGuestCart();

            router.push(AUTH_SUCCESS_ROUTES.user);
        } else {
            if (result.errors?.errors) {
                setErrors(result.errors.errors);
            } else if (result.errors?.general) {
                setGeneralError(result.errors.general);
            }
        }
    };

    const handleSocialLogin = async (provider: 'facebook' | 'google') => {
        await socialLogin(provider);
    };

    // Show loading while checking auth
    if (loading) {
        return (<CustomLoader/>);
    }

    // Don't show login form if user is already logged in
    if (user) {
        return null;
    }

    return (
        <div className="container">
            <div className="row justify-content-center ">
                <div className="col-md-4 col-sm-12 m-5 desktop-only-border rounded-4">
                    <div className="auth-card position-relative text_font  ">
                        {/* Top pointer (same as DropdownAuth design) */}

                        {generalError && (
                            <Alert
                                className={"w-auto m-xl-4 m-auto "}
                                message={generalError}
                                type="error"
                            />
                        )}

                        {error && (
                                <Alert
                                    className={"w-auto  m-xl-4  m-auto"}
                                    message={t('auth_filed','auth_filed')}
                                    type="error"
                                />

                        )}
                        <div className="auth-title  text-center title_font_bold mt-4">{t('login','login')}</div>

                        <form className="auth-form p-xl-4" autoComplete="on" onSubmit={handleSubmit}>
                            {/* Email error (top small alert like DropdownAuth) */}
                            {errors.email && (
                                <Alert
                                    className={"w-100"}
                                    message={errors.email[0]}
                                    type="error"
                                />

                            )}

                            <div className="form-group has-right-icon mb-2">
                                <input
                                    type="email"
                                    className={`form-control form-control-md ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder={t('email','email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    inputMode="email"
                                />
                                <span className="right-icon bi bi-envelope"></span>
                            </div>

                            {/* Password error (kept the same behavior; just styled) */}
                            <div className="form-group has-right-icon mb-2">
                                <input
                                    type="password"
                                    className={`form-control form-control-md ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder={t('password','password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="right-icon bi bi-lock"></span>
                            </div>

                            {errors.password && (
                                <Alert
                                    className={"w-100"}
                                    message={errors.password[0]}
                                    type="error"
                                />
                            )}

                            <Button
                                type="submit"
                                className={'mt-4 text-center title_font fw-bolder d-flex justify-content-center'}
                                variant={'my-btn-blue'}
                                startIcon={<UserIcon />}
                                style={{ width: '100%' }}
                            >
                                {t('login','login')}
                            </Button>

                            <div className="auth-or my-2">{t('or','or')}</div>

                            <div className="d-flex  gap-2">
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

                            <div className="text-center mt-3">
                                <LocalizedLink
                                    className="text_font text-decoration-none"
                                    href={'/register'}>

                                    {t('dont.have.account.register','dont.have.account.register')}
                                </LocalizedLink>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}
