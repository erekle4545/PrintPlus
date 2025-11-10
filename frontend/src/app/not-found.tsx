"use client";

import React from "react";

import Cover from "@/components/theme/header/cover/cover";

export default function NotFound() {
    return (
        <div  >
            <Cover/>
            <div className='container text-center p-5'  data-aos="fade">
                <h1 className="title_font fw-bolder" style={{color:'#FF5D5D'}}>404</h1>
                <h2 className="title_font">გვერდი ვერ მოიძებნა</h2>
                <p className="text_font text-muted">
                    ბოდიშით, თქვენ მიერ მოთხოვნილი გვერდი არ არსებობს ან წაიშალა.
                </p>

                <img src={'/assets/img/global/404.svg'} />

            </div>
        </div>
    );
}
