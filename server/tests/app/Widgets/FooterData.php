<?php

namespace App\Widgets;

use App\Helpers\Core\Multitenant;
use App\Models\Core\Services;
use App\Models\Core\Settings;
use Arrilot\Widgets\AbstractWidget;

class FooterData extends AbstractWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];

    /**
     * Treat this method as a controller action.
     * Return view() or other content to display.
     */
    public function run()
    {

        $this->config = Services::query()->with('info', function ($query) {
            $query->where('language_id', \App\Helpers\Core\Language::languageId());
        })->get();




        return view('widgets.footer_data', [
            'config' => $this->config,
        ]);
    }
}
