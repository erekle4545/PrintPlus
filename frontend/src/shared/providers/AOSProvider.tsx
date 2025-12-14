'use client';

import { useEffect } from 'react';
// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';

const AOSProvider = () => {
    useEffect(() => {
        AOS.init({
            duration: 400,
            once: true,
        });
    }, []);

    return null;
};

export default AOSProvider;
