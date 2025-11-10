import React from 'react';
import HomeCategories from "@/app/home/components/homeCategories";
import OurServices from "@/app/home/components/ourServices";
import OurProductsCarousel from "@/app/home/components/ourProductsCarousel";
import About from "@/app/home/components/about";

const HomePage = () => {
    return (
        <main className="container ">
            <HomeCategories />
            <OurServices />
            <OurProductsCarousel/>
            <About/>
        </main>
    );
};

export default HomePage;
