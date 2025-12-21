<?php

namespace App\Http\Controllers\API\Web;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Models\Core\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PageController extends Controller
{
    public function show(Request $request, $slug)
    {
        $modelPage = Multitenant::getModel('Page');
        $modelCategory = Multitenant::getModel('Category');
        $languageId = $request->language_id ?: 1;

        $page = null;
        $category = null;

        // Check if slug contains page ID (-p + number)
        if (preg_match('/-p(\d+)$/', $slug, $matches)) {
            $pageId = $matches[1];

            $page = $modelPage::with([
                'info' => function ($query) use ($languageId) {
                    $query->where('language_id', $languageId)
                        ->select(['id', 'language_id', 'page_id', 'title', 'slug', 'text', 'description'])
                        ->with('covers');
                },
                'categories' => function ($qu) use ($languageId) {
                    $qu->with([
                        'info' => function ($q) use ($languageId) {
                            $q->where('language_id', $languageId)
                                ->with('covers');
                        }
                    ]);
                }
            ])
                ->select(['id', 'template_id', 'show_home_page', 'status'])
                ->where('id', $pageId)
                ->where('status', 1)
                ->first();
        }
        // Check if slug contains category ID (-c + number)
        elseif (preg_match('/-c(\d+)$/', $slug, $matches)) {
            $categoryId = $matches[1];

            $category = $modelCategory::with([
                'info' => function ($query) use ($languageId) {
                    $query->where('language_id', $languageId)
                        ->select(['id', 'language_id', 'category_id', 'title', 'slug', 'description'])
                        ->with('covers');
                }
                ,
                'page' => function ($qu) use ($languageId) {
                    $qu->select(['id', 'template_id' ]);
                    $qu->with([
                        'info' => function ($q) use ($languageId) {
                            $q->where('language_id', $languageId)
                                ->with('covers');
                        }
                    ]);
                }
            ])

                ->select(['id', 'status', 'page_id'])
                ->where('id', $categoryId)
                ->where('status', 1)
                ->first();
        }

        // Check if either page or category was found
        if (!$page && !$category) {
            return response()->json([
                'message' => 'Resource not found'
            ], 404);
        }

        return response()->json([
            'data' => $page ?? $category
        ]);
    }
}
