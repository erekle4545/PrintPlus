<?php

namespace App\Providers;

use App\Events\Dictionary\DictionaryUpdate;
use App\Events\Menu\MenuChanged;
use App\Listeners\GenerateDictionary;
use App\Listeners\UpdateMenuRoutes;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        DictionaryUpdate::class => [
            GenerateDictionary::class
        ],
        MenuChanged::class => [
            UpdateMenuRoutes::class
        ]

    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
