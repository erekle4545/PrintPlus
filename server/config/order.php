<?php

return [

    'cities' => [
        'tbilisi' => [
            'id' => 1,
            'key' => 'tbilisi',
            'name' => 'თბილისი',
        ],
        'kutaisi' => [
            'id' => 2,
            'key' => 'kutaisi',
            'name' => 'ქუთაისი',
        ],
        'batumi' => [
            'id' => 3,
            'key' => 'batumi',
            'name' => 'ბათუმი',
        ],
    ],

    'statuses' => [
        'pending' => [
            'key' => 'pending',
            'name' => 'მოლოდინში',
            'color' => 'warning',
            'icon' => '⏳',
            'description' => 'შეკვეთა მიღებულია და ელოდება დამუშავებას',
        ],
        'processing' => [
            'key' => 'processing',
            'name' => 'მუშავდება',
            'color' => 'info',
            'icon' => '⚙️',
            'description' => 'შეკვეთა მუშავდება',
        ],
        'shipped' => [
            'key' => 'shipped',
            'name' => 'გზაშია',
            'color' => 'primary',
            'icon' => '🚚',
            'description' => 'შეკვეთა გაგზავნილია',
        ],
        'delivered' => [
            'key' => 'delivered',
            'name' => 'მიტანილია',
            'color' => 'success',
            'icon' => '✅',
            'description' => 'შეკვეთა წარმატებით მიტანილია',
        ],
        'cancelled' => [
            'key' => 'cancelled',
            'name' => 'გაუქმებული',
            'color' => 'danger',
            'icon' => '❌',
            'description' => 'შეკვეთა გაუქმებულია',
        ],
    ],

    'payment_statuses' =>  [
        'pending' => [
            'key' => 'pending',
            'name' => 'მოლოდინში',
            'color' => 'warning',
            'icon' => '⏳',
        ],
        'paid' => [
            'key' => 'paid',
            'name' => 'გადახდილია',
            'color' => 'success',
            'icon' => '✓',
        ],
        'failed' => [
            'key' => 'failed',
            'name' => 'ვერ განხორციელდა',
            'color' => 'danger',
            'icon' => '✗',
        ],
        'partially_refunded' => [
            'key' => 'partially_refunded',
            'name' => 'ნაწილობრივ დაბრუნებული',
            'color' => 'info',
            'icon' => '↩',
        ],
        'refunded' => [
            'key' => 'refunded',
            'name' => 'დაბრუნებული',
            'color' => 'secondary',
            'icon' => '↩',
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
