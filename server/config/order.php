<?php


    return [

        'cities' =>[
            'tbilisi'=>[
                'id'=>1,
                'key'=>'tbilisi',
                'name'=>'თბილისი',
            ],
            'kutaisi'=>[
                'id'=>2,
                'key'=>'kutaisi',
                'name'=>'ქუთაისი',
            ],
            'batumi'=>[
                'id'=>3,
                'key'=>'batumi',
                'name'=>'ბათუმი',
            ],
        ],


        'paymentMethods' => [
            'cash' => [
                'id' => 'cash',
                'key' => 'cash',
                'name' => 'ნაღდი ანგარიშსწორება',
                'icon' => '💵',
            ],
            'card' => [
                'id' => 'card',
                'key' => 'card',
                'name' => 'ბარათით გადახდა',
                'icon' => '💳',
            ],
            'bank_transfer' => [
                'id' => 'bank_transfer',
                'key' => 'bank_transfer',
                'name' => 'საბანკო გადარიცხვა',
                'icon' => '🏦',
            ],
        ],
    ];
