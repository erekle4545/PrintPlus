import React from 'react';
import {useParams} from "react-router-dom";

export default function OrderTransfer(){
    const params = useParams();
    return <div className=" mt-5 mob-btm-space ">
        <h1 className="title_font text-center">თქვენ აირჩიეთ გადახდის მეთოდი გადარიცხვა</h1>

        <div className='w-100 '>

            <h4 className='text_font text-center'>
                <strong>იხილეთ ჩვენი ანგარიშის ნომერბი</strong> <br/><br/>
                <strong>საქართველოს ბანკი:</strong> GE54BG0000000525944217 <br/>
                <strong>თიბისი ბანკი:</strong> GE31TB7813345064300042 <br/>
                <strong>მიმღები:</strong> (ი/მ) ერეკლე გიორგაძე <br/>
                <strong>დანიშნულებაში მიუთითეთ შეკვეთის კოდი:</strong> <span className='text-danger'>#{params.order_id}</span><br/>
            </h4>
        </div>
    </div>
}