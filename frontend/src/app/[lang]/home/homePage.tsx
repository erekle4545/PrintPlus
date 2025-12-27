
// app/[lang]/home/homePage.tsx

import React from 'react';
 import OurServices from "@/app/[lang]/home/components/ourServices";
import OurProductsCarousel from "@/app/[lang]/home/components/ourProductsCarousel";
import About from "@/app/[lang]/home/components/about";
import HomeTextPages from "@/app/[lang]/home/components/homeTextPages";
import {number} from "prop-types";
 import {PageData, PageInfo, TextPages} from "@/types/page/page";
import {GlobalInfo} from "@/types/globalTypes";
import {Product} from "@/types/product/productTypes";

interface HomePageProps {
    lang: string;
}

interface HomeData {
    text_pages: Array<TextPages>;
    services: PageData  | null;
    featuredProducts: Product[] | [];
    about: TextPages | null;
}

async function getHomeData(locale: string): Promise<HomeData> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/home?locale=${locale}`,
            {
                next: { revalidate: 1 },
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch home data');
        }

        return await response.json();

    } catch (error) {
        console.error('Error fetching home data:', error);
        return {
            text_pages: [],
            services: null,
            featuredProducts: [],
            about:null,
        };
    }
}

const HomePage = async ({ lang }: HomePageProps) => {
    // Fetch data on server
    const homeData = await getHomeData(lang);

    return (
        <main className="container">
            <HomeTextPages
                homeTextPages={homeData?.text_pages}
                locale={lang}
            />

            <OurServices
                services={homeData.services}
            />

            <OurProductsCarousel
                products={homeData.featuredProducts}
                locale={lang}
            />

            <About
                AboutProps={homeData?.about}
            />
        </main>
    );
};

export default HomePage;


