import React from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "../tamplate/sidebarNav";
import TopNav from "../tamplate/topNav";
import Footer from "../tamplate/footer";

const Layout = () => {
    return (
        <div className="wrapper">
            <SidebarNav />

            <div className="main">
                <TopNav />

                {/*<main className="content">*/}
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                {/*</main>*/}

                <Footer />
            </div>
        </div>
    );
};

export default Layout;
