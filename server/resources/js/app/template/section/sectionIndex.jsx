import React from 'react';
import Sidebar from "./sidebar";
import ProductSection from "./productSection";

export default function  SectionIndex(){
    return <div className='row  section-container'>
        <Sidebar/>
        <ProductSection/>
    </div>
}