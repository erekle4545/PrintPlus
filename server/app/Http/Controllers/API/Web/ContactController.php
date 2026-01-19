<?php

namespace App\Http\Controllers\API\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
class ContactController extends Controller
{

    /**
     * @param Request $request
     * @return SettingResource
     */
    public function index(Request $request)
    {
        $languageId = (int) $request->language_id;

        $cacheKey = "settings:first:lang:{$languageId}";

        $settings = Cache::tags(['settings'])
            ->remember($cacheKey, now()->addDays(30), function () use ($languageId) {

                $model = Multitenant::getModel('Settings');

                return $model::query()
                    ->whereHas('info', function ($q) use ($languageId) {
                        $q->where('language_id', $languageId);
                    })
                    ->with([
                        'info' => function ($q) use ($languageId) {
                            $q->where('language_id', $languageId);
                        },
                        'info.covers'
                    ])
                    ->first();
            });

        return new SettingResource($settings);
    }

}
