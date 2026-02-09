'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AUTH_SUCCESS_ROUTES } from "@/shared/utils/mix";
import Button from "@/shared/components/ui/button/Button";
import UserIcon from "@/shared/assets/icons/menu/user.svg";
import GoogleIcon from "@/shared/assets/icons/auth/google_page.svg";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [generalError, setGeneralError] = useState<string>('');

    const { t } = useLanguage();
    const { register, socialLogin, user, loading } = useAuth();
    const router = useRouter();

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

        const result = await register(name, email, phone, password, passwordConfirmation);

        if (result.success) {
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
        return (
            <div className="container text-center mt-5 mb-5">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">{t('loading', 'loading')}</span>
                </div>
            </div>
        );
    }

    // Don't show register form if user is already logged in
    if (user) {
        return null;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-4 col-sm-12 m-5 desktop-only-border rounded-4">
                    <div className="auth-card position-relative text_font">
                        <div className="auth-title text-center title_font_bold mt-4">
                            {t('register', 'register')}
                        </div>

                        {generalError && (
                            <div className="alert alert-danger text_font" role="alert">
                                {generalError}
                            </div>
                        )}

                        <form className="auth-form p-xl-4" autoComplete="on" onSubmit={handleSubmit}>
                            {/* Name */}
                            {errors.name && (
                                <div className="alert alert-danger alert-sm py-1 px-2 mb-2 small">
                                    {errors.name[0]}
                                </div>
                            )}
                            <div className="form-group has-right-icon mb-2">
                                <input
                                    type="text"
                                    className={`form-control form-control-md ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder={t('name', 'name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <span className="right-icon bi bi-person"></span>
                            </div>

                            {/* Email */}
                            {errors.email && (
                                <div className="alert alert-danger alert-sm py-1 px-2 mb-2 small">
                                    {errors.email[0]}
                                </div>
                            )}
                            <div className="form-group has-right-icon mb-2">
                                <input
                                    type="email"
                                    className={`form-control form-control-md ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder={t('email', 'email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    inputMode="email"
                                />
                                <span className="right-icon bi bi-envelope"></span>
                            </div>

                            {/* Phone */}
                            {errors.phone && (
                                <div className="text-danger small mb-2">{errors.phone[0]}</div>
                            )}
                            <div className="form-group has-right-icon mb-2">
                                <input
                                    type="text"
                                    className={`form-control form-control-md ${errors.phone ? 'is-invalid' : ''}`}
                                    placeholder={t('phone', 'phone')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    inputMode="tel"
                                />
                                <span className="right-icon bi bi-phone"></span>
                            </div>

                            {/* Password */}
                            {errors.password && (
                                <div className="text-danger small mb-2">{errors.password[0]}</div>
                            )}
                            <div className="form-group has-right-icon mb-2">
                                <input
                                    type="password"
                                    className={`form-control form-control-md ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder={t('password', 'password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="right-icon bi bi-lock"></span>
                            </div>

                            {/* Password confirmation */}
                            <div className="form-group has-right-icon mb-2">
                                <input
                                    type="password"
                                    className="form-control form-control-md"
                                    placeholder={t('repeat.password', 'repeat.password')}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required
                                />
                                <span className="right-icon bi bi-shield-lock"></span>
                            </div>

                            <Button
                                type="submit"
                                className={'text-center title_font fw-bolder d-flex justify-content-center'}
                                variant={'my-btn-blue'}
                                startIcon={<UserIcon />}
                                style={{ width: '100%' }}
                            >
                                {t('register', 'register')}
                            </Button>

                            <div className="auth-or my-2">{t('or', 'or')}</div>

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

                            <div className="text-center mt-3">
                                <LocalizedLink className="text_font text-decoration-none" href={'/login'}>
                                    {t('already.have.account.login', 'already.have.account.login')}
                                </LocalizedLink>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}
