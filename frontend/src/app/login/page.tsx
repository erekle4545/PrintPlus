'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {AUTH_SUCCESS_ROUTES} from "@/shared/utils/mix";
import Button from "@/shared/components/ui/button/Button";
import UserIcon from "@/shared/assets/icons/menu/user.svg";

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [generalError, setGeneralError] = useState<string>('');

    const { login, socialLogin, user, loading } = useAuth();

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
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">იტვირთება...</span>
                </div>
            </div>
        );
    }

    // Don't show login form if user is already logged in
    if (user) {
        return null;
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5 mb-5">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center title_font mb-4">
                                შესვლა
                            </h2>

                            {generalError && (
                                <div className="alert alert-danger text_font" role="alert">
                                    {generalError}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger text_font" role="alert">
                                    ავტორიზაცია ვერ მოხერხდა
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label text_font">
                                        ელ. ფოსტა
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback text_font">
                                            {errors.email[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label text_font">
                                        პაროლი
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback text_font">
                                            {errors.password[0]}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    className={'text-center  title_font fw-bolder d-flex justify-content-center'}
                                    variant={'my-btn-blue'}
                                    startIcon={<UserIcon />}
                                >
                                    შესვლა
                                </Button>
                            </form>

                            <div className="text-center mb-3">
                                <p className="text_font mb-3">
                                    ან შედით სოციალური ქსელით
                                </p>
                                <div className="d-flex gap-2 justify-content-center">
                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin('google')}
                                        className="btn btn-danger text_font"
                                    >
                                        <i className="bi bi-google me-2"></i>
                                        Google
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSocialLogin('facebook')}
                                        className="btn btn-primary text_font"
                                    >
                                        <i className="bi bi-facebook me-2"></i>
                                        Facebook
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                <Link href="/frontend/src/app/register" className="text_font text-decoration-none">
                                    არ გაქვთ ანგარიში? რეგისტრაცია
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}