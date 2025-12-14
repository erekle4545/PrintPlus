import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/index.css";
import { CartProvider } from "@/features/cart/context/CartContext";
import AOSProvider from "@/shared/providers/AOSProvider";
import Header from "@/shared/components/theme/header/header";
import Footer from "@/shared/components/theme/footer/footer";
import ProductList from "@/app/pages/products/productList";
import {AuthProvider} from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "Print Plus",
    description: "New Web site Print Plus",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <CartProvider>
                <AOSProvider/>
                    <Header />

                    {children}

                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        theme="colored"
                    />
                    <Footer />
                    {/*<ProductList/>*/}
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
