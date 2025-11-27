<?php

namespace App\Listeners;

use File;
use App\Events\Dictionary\DictionaryUpdate;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Artisan;

class GenerateDictionary
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  DictionaryUpdate  $event
     * @return void
     */
    public function handle(DictionaryUpdate $event)
    {
       Artisan::call('dictionary:update', []);
    }
}
