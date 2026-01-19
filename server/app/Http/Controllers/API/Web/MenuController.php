<?php

namespace App\Http\Controllers\API\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class MenuController extends Controller
{
    /**
     * @param Request $request
     * @return MenuResource
     */
    public function index(Request $request)
    {
        $languageId = (int) ($request->language_id ?: 1);
        $isOptions = (bool) $request->options;

        // Cache key based on language and request type
        $cacheKey = $isOptions
            ? "menu:options:lang:{$languageId}"
            : "menu:tree:lang:{$languageId}";

        $menu = Cache::tags(['menus'])
            ->remember($cacheKey, now()->addDays(30), function () use ($languageId, $isOptions, $request) {

                $model = Multitenant::getModel('Menu');

                $query = $model::with([
                    'info' => function ($query) use ($languageId) {
                        $query->where('language_id', $languageId);
                    }
                ])->orderBy('order', 'asc');

                if ($isOptions) {
                    $menu = $query->get()->toTree();
                    $this->transformMenuForOptions($menu);
                    return $menu;
                }

                return $query->withDepth()->get()->toTree();
            });

        return new MenuResource($menu);
    }

    /**
     * Transform menu tree for select options
     */
    private function transformMenuForOptions($collection, $parent = null)
    {
        foreach ($collection as $menu) {
            $menu->value = $menu->id;
            $menu->label = $menu->info['title'] ?? '';

            if ($menu->children && $menu->children->count() > 0) {
                $this->transformMenuForOptions($menu->children, $menu);
            } else {
                unset($menu->children);
            }
        }
    }

    /**
     * Clear menu cache (call this in your Menu update/delete methods)
     */
    public function clearMenuCache()
    {
        Cache::tags(['menus'])->flush();
    }

//    public function index(Request $request)
//    {
//
//        $model = Multitenant::getModel('Menu');
//
//        if ($request->options) {
//
//            $traverse = function ($collection, $parent = null) use (&$traverse, &$menus) {
//                foreach ($collection as $key => $menu) {
//                    $menu['value'] = $menu->id;
//                    $menu['label'] = $menu->info['title'];
//                    $menu['children'] = $menu->children;
//
//
//                    if ($menu->children) {
//                        if ($menu->children->count() === 0) {
//                            unset($menu->children);
//                        } else {
//                            $traverse($menu->children, $menu);
//                        }
//                    }
//                }
//            };
//
//            $menu = $model::with(['info' => function ($query) use ($request) {
//                $query->where('language_id', $request->language_id);
//            }, 'info'])->orderBy('order', 'asc')->getModels()->get()->toTree();
//
//            $traverse($menu);
//            return new MenuResource($menu);
//
//        }
//
//
//        return new MenuResource($menu = $model::with(['info' => function ($query) use ($request) {
//            $query->where('language_id', $request->language_id?:1);
//        },])->orderBy('order', 'asc')->withDepth()->get()->toTree());
//
//    }
}
