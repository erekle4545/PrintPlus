<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Category;
use App\Models\Core\Page;
use App\Models\Core\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{

    /**
     * Global search across products, categories, and pages
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2|max:100'
        ]);

        $query = $request->input('query');
        $languageId = $request->input('language_id', 1);

        // Cache search results for 5 minutes
        $cacheKey = "search:{$languageId}:{$query}";

        $results = Cache::remember($cacheKey, 300, function () use ($query, $languageId) {
            return $this->performSearch($query, $languageId);
        });

        return response()->json([
            'success' => true,
            'data' => $results,
            'meta' => [
                'query' => $query,
                'total_results' => count($results)
            ]
        ]);
    }

    /**
     * Perform the actual search
     */
    private function performSearch(string $query, int $languageId)
    {
        $results = [];

        // Search Products
        $products = Products::with(['info' => function ($q) use ($languageId) {
            $q->where('language_id', $languageId);
        },'covers','category.info:category_id,id,slug'])
            ->whereHas('info', function ($q) use ($query, $languageId) {
                $q->where('language_id', $languageId)
                    ->where(function ($subQ) use ($query) {
                        $subQ->where('name', 'like', "%{$query}%")
                            ->orWhere('description', 'like', "%{$query}%");
                    });
            })
            ->where('status', 1)
            ->limit(10)
            ->get();

        foreach ($products as $product) {
            $results[] = [
                'id' => $product->id,
                'title' => $product->info->name ?? 'N/A',
                'description' => $product->info->description ?? null,
                'type' => 'product',
                'slug' => $product->category->info->slug?? null.'/'.$product->info->slug ?? null,
                'image' => $product->covers->first()?->path ?? null,
            ];
        }

        // Search Categories
        $categories = Category::with(['info' => function ($q) use ($languageId) {
            $q->where('language_id', $languageId);
        }])
            ->whereHas('info', function ($q) use ($query, $languageId) {
                $q->where('language_id', $languageId)
                    ->where(function ($subQ) use ($query) {
                        $subQ->where('title', 'like', "%{$query}%")
                            ->orWhere('description', 'like', "%{$query}%");
                    });
            })
            ->where('status', 1)
            ->limit(5)
            ->get();

        foreach ($categories as $category) {
            $results[] = [
                'id' => $category->id,
                'title' => $category->info->title ?? 'N/A',
                'description' => $category->info->description ?? null,
                'type' => 'category',
                'slug' => $category->info->slug ?? null,
                'category_id' => $category->id,
                'image' => $category->covers->first()?->path ?? null,
            ];
        }

        // Search Pages
        $pages = Page::with(['info' => function ($q) use ($languageId) {
            $q->where('language_id', $languageId);
        }])
            ->whereHas('info', function ($q) use ($query, $languageId) {
                $q->where('language_id', $languageId)
                    ->where(function ($subQ) use ($query) {
                        $subQ->where('title', 'like', "%{$query}%")
                            ->orWhere('description', 'like', "%{$query}%");
                    });
            })
            ->where('status', 1)
            ->limit(5)
            ->get();

        foreach ($pages as $page) {
            $results[] = [
                'id' => $page->id,
                'title' => $page->info->title ?? 'N/A',
                'description' => $page->info->description ?? null,
                'type' => 'page',
                'slug' => $page->info->slug ?? null,
                'page_id' => $page->id,
            ];
        }

        return $results;
    }

    /**
     * Search suggestions for autocomplete
     */
    public function suggestions(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2|max:100'
        ]);

        $query = $request->input('query');
        $languageId = $request->input('language_id', 1);

        $cacheKey = "search_suggestions:{$languageId}:{$query}";

        $suggestions = Cache::remember($cacheKey, 300, function () use ($query, $languageId) {
            return Products::with(['info' => function ($q) use ($languageId) {
                $q->where('language_id', $languageId);
            },'covers','category.info:category_id,id,slug'])
                ->whereHas('info', function ($q) use ($query, $languageId) {
                    $q->where('language_id', $languageId)
                        ->where('name', 'like', "%{$query}%");
                })
                ->where('status', 1)
                ->limit(5)
                ->get()
                ->pluck('info.name')
                ->filter()
                ->values();
        });

        return response()->json([
            'success' => true,
            'data' => $suggestions
        ]);
    }
}
