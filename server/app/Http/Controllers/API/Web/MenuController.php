<?php

namespace App\Http\Controllers\API\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Models\Core\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    public function index(Request $request)

    {

        $model = Multitenant::getModel('Menu');

        if ($request->options) {



            $traverse = function ($collection, $parent = null) use (&$traverse, &$menus) {
                foreach ($collection as $key => $menu) {
                    $menu['value'] = $menu->id;
                    $menu['label'] = $menu->info['title'];
                    $menu['children'] = $menu->children;


                    if ($menu->children) {
                        if ($menu->children->count() === 0) {
                            unset($menu->children);
                        } else {
                            $traverse($menu->children, $menu);
                        }
                    }
                }
            };

            $menu = $model::with(['info' => function ($query) use ($request) {
                $query->where('language_id', $request->language_id);
            }, 'info'])->orderBy('order', 'asc')->getModels()->get()->toTree();

            $traverse($menu);
            return new MenuResource($menu);

        }


        return new MenuResource($menu = $model::with(['info' => function ($query) use ($request) {
            $query->where('language_id', $request->language_id?:1);
        },])->orderBy('order', 'asc')->withDepth()->get()->toTree());

    }
}
