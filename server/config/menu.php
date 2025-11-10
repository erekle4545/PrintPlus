<?php

return [
    /**
     * menu activation status
     */
    'status' => [
        'active' => 1,
        'inactive' => 2,
    ],


    'type' => [

        'static' => [
            'id'=>1,
            'name'=>'static page'
        ],
        'dynamic' => [
            'id'=>2,
            'name'=>'dynamic page'
        ],
    ],

    'show_types' => [
        'meetings_and_numbers_base' => [
            'id'=>1,
            'name'=>'აჩვენოს ნომრების ბაზაში და შეხვედრებში'
        ],
        'only_meetings' => [
            'id'=>2,
            'name'=>'აჩვენოს მხოლოდ შეხვედრებში'
        ],
        'numbers_base' => [
            'id'=>3,
            'name'=>'აჩვენოს მხოლოდ ნომრების ბაზაში'
        ],
    ],


    'templates' => [

        'products' => [
            'id' => 1,
            'name' => 'პროდუქტები',
            'key'=>'products',
            'defaultSlug'=>'products',
            'icon'=>'fa fa-shopping-cart',
            'show' => true,
        ],
        'orders' => [
            'id' => 2,
            'name' => 'შეკვეთები',
            'key'=>'orders',
            'defaultSlug'=>'orders',
            'icon'=>'fa fa-th-list',
            'show' => true,
        ],
        'category' => [
            'id' => 3,
            'name' => 'კატეგორიები',
            'key'=>'category',
            'defaultSlug'=>'category',
            'icon'=>'fa fa-folder-open',
            'show' => true,
        ],
        'customers' => [
            'id' => 4,
            'name' => 'მომხმარებლები',
            'key'=>'customers',
            'defaultSlug'=>'customers',
            'icon'=>'fa fa-users',
            'show' => true,
        ],
        'users' => [
            'id' =>5,
            'name' => 'თანამშრომლები',
            'key'=>'users',
            'defaultSlug'=>'users',
            'icon'=>'fa fa-address-book',
            'show' => true,
        ],
//        'roles' => [
//            'id' =>6,
//            'name' => 'პოზიციები',
//            'key'=>'roles',
//            'defaultSlug'=>'roles',
//            'icon'=>'fa fa-address-book',
//            'show' => false,
//        ]
    ],
];
