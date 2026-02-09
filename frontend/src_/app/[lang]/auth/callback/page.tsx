import { Suspense } from 'react';
import AuthCallbackContent from './AuthCallbackContent';

interface AuthCallbackPageProps {
    params: {
        lang: string;
    };
}

export default function AuthCallbackPage({ params }: AuthCallbackPageProps) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}

function LoadingFallback() {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">იტვირთება...</span>
                </div>
                <p className="text_font">მიმდინარეობს ავტორიზაცია...</p>
            </div>
        </div>
    );
}