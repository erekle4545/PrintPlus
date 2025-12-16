<?php

namespace App\Http\Controllers\API\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show(Request $request, $slug)
    {
        $model = Multitenant::getModel('Page');


        $page = $model::with(['info' => function ($query) use ($request) {
            $query->where('language_id', $request->language_id ?: 1);
        }])
            ->whereHas('info', function ($query) use ($slug, $request) {
                $query->where('slug', $slug)
                    ->where('language_id', $request->language_id ?: 1);
            })
            ->where('status', 1)
            ->first();

        if (!$page) {
            return response()->json([
                'message' => 'Page not found'
            ], 404);
        }

        return response()->json([
            'data' => $page
        ]);
    }
}
