<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Dictionary;
use App\Models\Core\DictionaryLanguage;
use App\Models\Core\Languages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DictionaryController extends Controller
{

    public function getTranslations($langCode)
    {
        $cacheKey = "translations:lang:{$langCode}";

        $result = Cache::tags(['translations'])->get($cacheKey);

        $fromCache = true;

        if (!$result) {
            $fromCache = false;

            $language = Languages::where('code', $langCode)
                ->where('status', 1)
                ->first();

            if (!$language) {
                return response()->json([
                    'success' => false,
                    'message' => 'Language not found'
                ], 404);
            }

            $translations = DictionaryLanguage::where('language_id', $language->id)
                ->with('dictionary:id,word')
                ->get()
                ->mapWithKeys(fn ($item) => [
                    $item->dictionary->word => $item->value
                ]);

            $result = [
                'success' => true,
                'data' => $translations
            ];

            Cache::tags(['translations'])->put(
                $cacheKey,
                $result,
                now()->addDays(30)
            );
        }

        return response()
            ->json($result)
            ->header('X-Cache-Hit', $fromCache ? 'true' : 'false')
            ->header('X-Cache-Key', $cacheKey)
            ->header('Cache-Control', 'public, max-age=86400, immutable');
    }


    public function getByLanguage($langCode)
    {
        $cacheKey = "dictionaries:lang:{$langCode}";

        $fromCache = Cache::tags(['dictionaries'])->has($cacheKey);


        $result = Cache::tags(['dictionaries'])
            ->remember($cacheKey, now()->addDays(30), function () use ($langCode) {

                $language = Languages::where('code', $langCode)->first();

                if (!$language) {
                    return [
                        'success' => false,
                        'message' => 'Language not found',
                        'status' => 404
                    ];
                }

                $dictionaries = Dictionary::with(['infos' => function($query) use ($language) {
                    $query->where('language_id', $language->id);
                }])->get();

                return [
                    'success' => true,
                    'data' => $dictionaries,
                    'status' => 200
                ];
            });

        return response()
            ->json([
                'success' => $result['success'],
                'message' => $result['message'] ?? null,
                'data' => $result['data'] ?? null
            ], $result['status'])
            ->header('X-Cache-Hit', $fromCache ? 'true' : 'false')
            ->header('X-Cache-Key', $cacheKey)
            ->header('Cache-Control', 'public, max-age=86400, immutable');
    }

    /**
     * Clear translations cache
     * Call this when dictionary is updated
     */
    public function clearTranslationsCache()
    {
        Cache::tags(['translations'])->flush();
        Cache::tags(['dictionaries'])->flush();

        return response()->json([
            'success' => true,
            'message' => 'Cache cleared successfully'
        ]);
    }
//    public function getTranslations($langCode)
//    {
//        $language = Languages::where('code', $langCode)
//            ->where('status', 1)
//            ->first();
//
//        if (!$language) {
//            return response()->json([
//                'success' => false,
//                'message' => 'Language not found'
//            ], 404);
//        }
//
//        $translations = DictionaryLanguage::where('language_id', $language->id)
//            ->with('dictionary')
//            ->get()
//            ->mapWithKeys(function ($item) {
//                return [$item->dictionary->word => $item->value];
//            });
//
//        return response()->json([
//            'success' => true,
//            'data' => $translations
//        ]);
//    }
//
//    public function getByLanguage($langCode)
//    {
//        $language = Languages::where('code', $langCode)->first();
//
//        if (!$language) {
//            return response()->json([
//                'success' => false,
//                'message' => 'Language not found'
//            ], 404);
//        }
//
//        $dictionaries = Dictionary::with(['infos' => function($query) use ($language) {
//            $query->where('language_id', $language->id);
//        }])->get();
//
//        return response()->json([
//            'success' => true,
//            'data' => $dictionaries
//        ]);
//    }

    public function store(Request $request)
    {
        $request->validate([
            'word' => 'required|string|unique:dictionaries,word',
            'translations' => 'required|array',
            'translations.*.language_id' => 'required|exists:languages,id',
            'translations.*.value' => 'required|string'
        ]);

        $dictionary = Dictionary::create([
            'word' => $request->word
        ]);

        foreach ($request->translations as $translation) {
            DictionaryLanguage::create([
                'dictionary_id' => $dictionary->id,
                'language_id' => $translation['language_id'],
                'value' => $translation['value']
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Translation added successfully',
            'data' => $dictionary->load('infos')
        ], 201);
    }
}
