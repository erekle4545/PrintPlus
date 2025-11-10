<?php

namespace App\Helpers\Core;
use Illuminate\Support\Facades\URL;

abstract class Components
{

    public static function currentLocation($data)
    {
        echo '<section class="breadcrumbs">
                <div class="container">
                    <ol class="breadcrumb breadcrumb-dot">
                        <li class="breadcrumb-item"><a href="'.URL::to(Language::current()).'">'.Language::translate('home').'</a></li>
                        <li class="breadcrumb-item active"><a href="#">'.$data.'</a></li>
                    </ol>
                </div>
            </section>';
    }


}
