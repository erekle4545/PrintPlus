'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {AUTH_SUCCESS_ROUTES} from "@/shared/utils/mix";

export default function Page() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [generalError, setGeneralError] = useState<string>('');

    const { register, user, loading } = useAuth();
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

        const result = await register(name, email, password, passwordConfirmation);

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

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="container text-center mt-5 mb-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
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
            <div className="row justify-content-center mt-5 mb-5">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center title_font mb-4">
                                რეგისტრაცია
                            </h2>

                            {generalError && (
                                <div className="alert alert-danger text_font" role="alert">
                                    {generalError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label text_font">
                                        სახელი
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback text_font">
                                            {errors.name[0]}
                                        </div>
                                    )}
                                </div>

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

                                <div className="mb-3">
                                    <label htmlFor="password_confirmation" className="form-label text_font">
                                        გაიმეორეთ პაროლი
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password_confirmation"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3 text_font"
                                >
                                    რეგისტრაცია
                                </button>
                            </form>

                            <div className="text-center">
                                <Link href="/frontend/src/app/login" className="text_font text-decoration-none">
                                    უკვე გაქვთ ანგარიში? შესვლა
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}