<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Possible statuses for pages
    |--------------------------------------------------------------------------
    */

    'status' => [
        'active' => 1,
        'inactive' => 2,
    ],

    /*
    |--------------------------------------------------------------------------
    | Possible types for page covers
    |--------------------------------------------------------------------------
    | Refers to config.files.covers
    */

    'covers' => [
        'file',
    ],


    'payments_states' => [
        'paid' => [
            'id' => 1,
            'name' => 'გადარიცხვა',
        ],
        'enrollment' => [
            'id' => 2,
            'name' => 'ბარათით გადახდა',
        ],
        'will_pay_delivery' => [
            'id' => 3,
            'name' => 'კურიერთან გადაიხდის',
        ],
        'cancel' => [
            'id' => 4,
            'name' => 'გააუქმა',
        ],
        'transfer_checked' => [
            'id' => 5,
            'name' => 'გადმორიცხული (დადასტურებული)',
        ],
    ],


    'delivery_types' => [
        'tbilisi' => [
            'id' => 1,
            'name' => 'თბილისი',
        ],
        'region' => [
            'id' => 2,
            'name' => 'რეგიონები',
        ],
    ],

    'delivery_time' => [
        'pirveli_naxevari' => [
            'id' => 1,
            'name' => '11:00 - 15:00',
        ],
        'meore_naxevari' => [
            'id' => 2,
            'name' => '15:00 - 18:00',
        ],
        'mesame_naxevari' => [
            'id' => 3,
            'name' => '18:00 - 22:00',
        ],
    ],

    'delivery_prices' => [
        'conditional'=> [
            'conditional'=>99
        ],
        'tbilisi' => [
            'id' => 1,
            'price'=>5,
            'name' => 'თბილისი',
        ],
        'region' => [
            'id' => 2,
            'price'=>10,
            'name' => 'რეგიონები',
        ]
    ]


];
