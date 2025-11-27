<?php
return [

    /*
    |--------------------------------------------------------------------------
    | Possible statuses for pages
    |--------------------------------------------------------------------------
    |
    |
    |
    |
    |
    |
    |
    */
    'status' => [
        'active' => 1,
        'inactive' => 2,
    ],

    /*
    |--------------------------------------------------------------------------
    | Possible types for page covers
    |--------------------------------------------------------------------------
    |
    | Refers to config.files.covers
    |
    |
    */
    'covers' => [
        'default',
//        'facebook',
//        'video',
//        'gallery',
        'page_cover'
    ],

    /*
    |--------------------------------------------------------------------------
    | Possible statuses for pages
    |--------------------------------------------------------------------------
    |
    |
    |
    |
    */
    'templates' => [
        'text' => [
            'id' => 1,
            'name' =>'text',
            'show' => true,
        ],
        'form' => [
            'id' => 2,
            'name'=>'form',
            'show' => false,
        ],
        'news' => [
            'id' => 3,
            'name'=>'news',
            'show' => true,
        ],
//        'faq' => [
//            'id' => 5,
//            'name' => 'faq',
//            'show' => false,
//        ],
//        'gallery' => [
//            'id' => 6,
//            'name' => 'gallery',
//            'show' => true,
//        ],
//        'team'=>[
//            'id' => 7,
//            'name' => 'team',
//            'show' => true,
//        ],
//        'projects' => [
//            'id' => 9,
//            'name' => 'projects',
//            'show' => true,
//        ],
        'about' => [
            'id' => 11,
            'name' => 'about',
            'show' => false,
        ],
        'services' => [
            'id' => 17,
            'name' => 'services',
            'show' => true,
        ],
        'car_brands' => [
            'id' => 18,
            'name' => 'car_brands',
            'show' => true,
        ],
//        'about_project' => [
//            'id' => 12,
//            'name' => 'about_project',
//            'show' => true,
//        ],
//        'rules' => [
//            'id' => 13,
//            'name' => 'rules',
//            'show' => true,
//        ],
//        'donors_partners' => [
//            'id' => 14,
//            'name' => 'donors_partners',
//            'show' => true,
//        ],
//        'problems_interactive' => [
//            'id' => 15,
//            'name' => 'problems_interactive',
//            'show' => true,
//        ],
//        'experts' => [
//            'id' => 16,
//            'name' => 'experts',
//            'show' => true,
//        ],
    ]
];
