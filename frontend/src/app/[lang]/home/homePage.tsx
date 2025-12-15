import React from 'react';
import HomeCategories from "@/app/[lang]/home/components/homeCategories";
import OurServices from "@/app/[lang]/home/components/ourServices";
import OurProductsCarousel from "@/app/[lang]/home/components/ourProductsCarousel";
import About from "@/app/[lang]/home/components/about";

interface HomePageProps {
    lang?: string;
}

const HomePage: React.FC<HomePageProps> = ({ lang }) => {
    return (
        <main className="container">

            <HomeCategories />
            <OurServices />
            <OurProductsCarousel />
            <About />
        </main>
    );
};

export default HomePage;