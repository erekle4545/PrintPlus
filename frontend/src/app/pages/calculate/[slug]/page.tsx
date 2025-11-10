'use client';

import React, { useMemo, useState } from 'react';
import { GEL } from '@/utils/currency';
import Cover from '@/components/theme/header/cover/cover';
import { HeaderTitle } from '@/components/theme/page/components/headerTitle';
import TealCheckbox from "@/components/ui/tealCheckbox/tealCheckbox";

// --- Types & data ---
type ProductKey = 'outdoor_banner' | 'sticker' | 'backlit' | 'photo_paper' | 'vinyl';

const PRODUCTS: Record<ProductKey, { title: string; ratePerM2: number }> = {
    outdoor_banner: { title: 'გარე ბანერი', ratePerM2: 28 },
    vinyl: { title: 'ბანერის ქსოვილი (vinyl)', ratePerM2: 32 },
    sticker: { title: 'სტიკერი', ratePerM2: 35 },
    backlit: { title: 'ბექლიტი', ratePerM2: 40 },
    photo_paper: { title: 'ფოტოქაღალდი', ratePerM2: 30 },
};

const EXTRAS = { service: 50, eyelets: 20, lamination: 30 };

type PieceCols = { '20': number; '50': number; '100': number; '200': number; '300+': number };
type OffsetCols = { '1000': number; '2000': number; '3000': number; '5000': number };
type PriceRow = { name: string; piece: PieceCols; offset: OffsetCols };

const PIECE_COLS = ['20', '50', '100', '200', '300+'] as const;
const OFFSET_COLS = ['1000', '2000', '3000', '5000'] as const;

const TABLE_ROWS: PriceRow[] = [
    { name: 'ფლაერები (99×210)', piece: { '20': 20, '50': 35, '100': 60, '200': 120, '300+': 170 }, offset: { '1000': 250, '2000': 300, '3000': 350, '5000': 450 } },
    { name: 'ბუკლეტი (198×210)', piece: { '20': 45, '50': 90, '100': 180, '200': 300, '300+': 420 }, offset: { '1000': 290, '2000': 320, '3000': 400, '5000': 650 } },
    { name: 'ტრიფოლდი (297×210)', piece: { '20': 50, '50': 120, '100': 200, '200': 320, '300+': 370 }, offset: { '1000': 470, '2000': 520, '3000': 580, '5000': 800 } },
];

// map value -> 0..100%
const toPercent = (value: number, min = 50, max = 1000) =>
    Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

export default function CalculatePage() {
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(500);
    const [active, setActive] = useState<ProductKey>('outdoor_banner');

    const [withService, setWithService] = useState(true);
    const [withEyelets, setWithEyelets] = useState(false);
    const [withLamination, setWithLamination] = useState(false);

    const m2 = useMemo(() => (width * height) / 10000, [width, height]);
    const base = useMemo(() => PRODUCTS[active].ratePerM2 * m2, [active, m2]);
    const extras = useMemo(
        () => (withService ? EXTRAS.service : 0) + (withEyelets ? EXTRAS.eyelets : 0) + (withLamination ? EXTRAS.lamination : 0),
        [withService, withEyelets, withLamination]
    );
    const total = useMemo(() => Math.max(Math.round(base + extras), 50), [base, extras]); // min 50₾

    return (
        <>
            <Cover />
            <div className="container py-4 ">
                <HeaderTitle title="კალკულატორის გვერდი" slug={[]} />
                <div className='calculate-page-container' data-aos={'fade-up'}>
                    {/* Calculator */}
                    <h4 className='title_font_bold text-center mb-4' >ფასის კალკულატორი</h4>
                    <div className="calculate-card   rounded-4 mb-4"  >
                        <div className="card-body  p-4">
                            {/* Tabs */}
                            <ul className="nav nav-pills seg-pills gap-2 mb-4 flex-wrap title_font_bold ">
                                {Object.entries(PRODUCTS).map(([key, v]) => {
                                    const k = key as ProductKey;
                                    const activeCls = active === k ? 'btn-teal' : 'btn-outline-secondary';
                                    return (
                                        <li key={k} className="nav-item">
                                            <button className={`btn ${activeCls} px-3 py-2`} onClick={() => setActive(k)}>
                                                {v.title}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Sliders */}
                            <div className="row g-4">
                                {/* width */}
                                <div className="col-md-6">

                                    <div className="slider">
                                        <div className="slider-track">
                                            <div className="slider-fill" style={{ width: `${toPercent(width)}%` }} />
                                            <div className="slider-dots" />
                                        </div>
                                        <input type="range" min={50} max={1000} step={10} value={width} onChange={(e) => setWidth(parseInt(e.target.value, 10))} className="slider-input" />
                                        <span className="slider-badge" style={{ left: `${toPercent(width)}%` }}>{width}სმ</span>
                                    </div>
                                    <label className="form-label  mt-2">
                                        <span className='fw-semibold'>სიგანე </span>
                                        <span className="text-muted small text_font">მინიმალური სიგანე 50სმ</span>
                                    </label>
                                </div>

                                {/* height */}
                                <div className="col-md-6">

                                    <div className="slider">
                                        <div className="slider-track">
                                            <div className="slider-fill" style={{ width: `${toPercent(height)}%` }} />
                                            <div className="slider-dots" />
                                        </div>
                                        <input type="range" min={50} max={1000} step={10} value={height} onChange={(e) => setHeight(parseInt(e.target.value, 10))} className="slider-input" />
                                        <span className="slider-badge" style={{ left: `${toPercent(height)}%` }}>{height}სმ</span>
                                    </div>
                                    <label className="form-label  mt-2">
                                        <span className='fw-semibold'>სიმაღლე </span>
                                        <span className="text-muted small text_font">მინიმალური სიმაღლე 50სმ</span>
                                    </label>
                                </div>
                            </div>

                            {/* Options */}
                            <div className='d-flex justify-content-center '>
                                <div className="mt-3">
                                    <div className="form-check mb-2">
                                        <TealCheckbox
                                            label="სავალდებულო მომსახურებები (მონტაჟი, გაჭიმვა და ა.შ.)"
                                            checked={withService}
                                            onChange={(e) => setWithService(e.target.checked)}
                                        />
                                    </div>
                                    <div className="form-check mb-2">
                                        <TealCheckbox
                                            label="ზოლში დაჭერა / ჩამოკიდება (გამაძლებელი კორდით)"
                                            checked={withEyelets}
                                            onChange={(e) => setWithEyelets(e.target.checked)}

                                        />
                                    </div>
                                    <div className="form-check mb-2">
                                        <TealCheckbox
                                            label="ლამინაცია რაოდენობით"
                                            checked={withLamination}
                                            onChange={(e) => setWithLamination(e.target.checked)}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Total */}
                            <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                                <div className="fw-semibold">ჯამური ფასი:</div>
                                <div className="price-chip">{GEL(total)}</div>
                            </div>
                            <div className="small text-center text-muted mt-4">საბოლოო ფასი დამოკიდებულია არჩევანზე: მ² × ტარიფი + მომსახურება. მინიმალური შეკვეთა 50₾.</div>
                        </div>
                    </div>

                    {/* Price table */}
                    <h4 className="text-center fw-bold mb-3">ფასების ცხრილი</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle shadow-sm">
                            <thead>
                            <tr>
                                <th className="bg-info text-white text-center" style={{ width: 220 }}>მოდელი</th>
                                <th colSpan={5} className="bg-info text-white text-center">ცალობით</th>
                                <th colSpan={4} className="bg-info text-white text-center">ოფსეტური</th>
                            </tr>
                            <tr className="table-dark text-center">
                                <th>სახეობა</th>
                                {PIECE_COLS.map((k) => <th key={k}>{k}</th>)}
                                {OFFSET_COLS.map((k) => <th key={k}>{k}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {TABLE_ROWS.map((r) => (
                                <tr key={r.name}>
                                    <td className="fw-semibold">{r.name}</td>
                                    {PIECE_COLS.map((k) => <td key={k} className="text-center">{GEL(r.piece[k])}</td>)}
                                    {OFFSET_COLS.map((k) => <td key={k} className="text-center">{GEL(r.offset[k])}</td>)}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom text */}
                    <div className="mt-4">
                        <h6 className="fw-bold mb-2">ტექნიკური მოთხოვნის მითითება</h6>
                        <p className="text-muted">ორდერის დეტალად მიუთითეთ ფორმატი, ფერიანობა, დაჭერის ტიპები და რაოდენობა. ფაილები ჯობს იყოს ვექტორში ან მაღალი ხარისხის PDF/JPEG.</p>

                        <h6 className="fw-bold mb-2">ფაილების მიღება/დამზადება და კონტროლი</h6>
                        <p className="text-muted">მიღების შემდეგ ვამოწმებთ ზომებს, ფერებსა და პროფილებს და ვადაპტირებთ რეალურ ზომებზე. საჭიროების შემთხვევაში იგზავნება შენიშვნები.</p>

                        <h6 className="fw-bold mb-2">პროდუქციის გატანის პირობები</h6>
                        <p className="text-muted">OQ-ის მიღებისთანავე გატანა შესაძლებელია ოფისიდან ან კურიერით. წინასწარ ჩაწერეთ დამატებითი მითითებები სწრაფი წარმოებისთვის.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
