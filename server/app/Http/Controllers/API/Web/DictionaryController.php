<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Dictionary;
use App\Models\Core\DictionaryLanguage;
use App\Models\Core\Languages;
use Illuminate\Http\Request;

class DictionaryController extends Controller
{
    public function getTranslations($langCode)
    {
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
            ->with('dictionary')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->dictionary->word => $item->value];
            });

        return response()->json([
            'success' => true,
            'data' => $translations
        ]);
    }

    public function getByLanguage($langCode)
    {
        $language = Languages::where('code', $langCode)->first();

        if (!$language) {
            return response()->json([
                'success' => false,
                'message' => 'Language not found'
            ], 404);
        }

        $dictionaries = Dictionary::with(['infos' => function($query) use ($language) {
            $query->where('language_id', $language->id);
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $dictionaries
        ]);
    }

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
