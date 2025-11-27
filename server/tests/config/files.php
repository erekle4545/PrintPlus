<?php


return [
    /*
   |--------------------------------------------------------------------------
   | CDN URL
   |--------------------------------------------------------------------------
   |
   |
   |
   |
   |
   */
    'cdn' => 'https://domain.com/public',
    'formats'=>'mp4,webm,png,jpg,JPG,svg,jpeg,pdf',
    'size'=>'204800',
    /*
   |--------------------------------------------------------------------------
   | File grooups]
   |--------------------------------------------------------------------------
   |
   |
   |
   |
   |
   */
    'groups' => [
        'audio' => 1,
        'video' => 2,
        'image' => 3,
        'other' => 4,
    ],

    /*
   |--------------------------------------------------------------------------
   | extension mappings to groups
   |--------------------------------------------------------------------------
   |
   |
   |
   |
   |
   */
    'type_groups' => [
        'pdf' => 'other',
        'txt' => 'other',
        'xls' => 'other',
        'xlsx'=> 'other',
        'doc' => 'other',
        'docx'=> 'other',
        'jpg' => 'image',
        'jpeg'=> 'image',
        'png' => 'image',
        'svg' => 'image',
        'gif' => 'image',
        'mp4' => 'video',
    ],

    /*
   |--------------------------------------------------------------------------
   | Files types
   |--------------------------------------------------------------------------
   |
   |
   |
   |
   |
   */
    'types' => [
        'pdf',
        'txt',
        'xls',
        'xlsx',
        'doc',
        'docx',
        'jpg',
        'jpeg',
        'png',
        'svg',
        'gif',
        'mp4',
    ],

    /*
    |--------------------------------------------------------------------------
    | Thumbnail sizes
    |--------------------------------------------------------------------------
    |
    |
    |
    |
    |
    */
    'thumb_sizes' => [
        /* Projects */
        [
            'width' => 1366,
            'height' => 768,
        ],
        [
            'width' => 352,
            'height' => 197,
        ],
        /* News */
        [
            'width' => 767,
            'height' => 501,
        ],
        /* Actions */
        [
            'width' => 445,
            'height' => 362,
        ],
        /* Processes */
        [
            'width' => 168,
            'height' => 230,
        ],
        /* Default */
        [
            'width' => 320,
            'height' => 180,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    |
    |--------------------------------------------------------------------------
    |
    |
    |
    |
    |
    */
    'uploader' => [
        'admin' => 1,
        'user'  => 2,
    ],

    /**
     *
     */
    'statuses' => [
        'active' => 1,
    ],

    /*
    |--------------------------------------------------------------------------
    | Cover Types
    |--------------------------------------------------------------------------
    |
    | This option determines how cover can be used
    |
    |
    |
    */
    'covers' => [
        'default'  => [
            'id' => 1,
            'description' => 'Default Cover',
        ],
        'facebook' => [
            'id' => 2,
            'description' => 'Facebook cover',
        ],
        'slider'   => [
            'id' => 3,
            'description' => 'Slider Cover',
        ],
        'project_image'   => [
            'id' => 4,
            'description' => 'Map Image',
        ],
        'project_thumbnail'   => [
            'id' => 5,
            'description' => 'Thumbnail Image',
        ],
        'main_image'   => [
            'id' => 6,
            'description' => 'Default Image',
        ],

        'user_avatar' => [
            'id' => 7,
            'description' => 'User Avatar',
        ],
        'header_logo' => [
            'id' => 9,
            'description' => 'Header logo Color',
        ],
        'favicon' => [
            'id' => 10,
            'description' => 'Site Favicon',
        ],
        'footer_logo' => [
            'id' => 13,
            'description' => 'Footer logo ',
        ],
//        'video' => [
//            'id' => 13,
//            'description' => 'video thumbnail ',
//        ],
        'gallery' => [
            'id' => 14,
            'description' => 'Gallery',
        ],
        'icon' => [
            'id' => 15,
            'description' => 'Icon ',
        ],
        'slider_background' => [
            'id' => 16,
            'description' => 'Slider BackGround ',
        ],
        'gallery_thumb' => [
            'id' => 17,
            'description' => 'Gallery thumbnail',
        ],
        'page_cover' => [
            'id' => 18,
            'description' => 'Page Background Cover',
        ],
    ],
];
