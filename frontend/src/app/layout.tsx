import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../styles/index.css";
import { CartProvider } from '@/features/cart/context/CartContext'
import ProductList from "@/app/pages/products/productList";
import AOSProvider from "@/components/providers/AOSProvider";
import {hidden} from "next/dist/lib/picocolors";
import Header from "@/components/theme/header/header";
import Footer from "@/components/theme/footer/footer";

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
        <Header/>
            <AOSProvider/>
            <CartProvider>
              {children}
              {/*<ProductList/>*/}
            </CartProvider>
            <ToastContainer position="top-right" autoClose={3000} theme="light" />
        <Footer/>
      </body>
    </html>
  );
}
