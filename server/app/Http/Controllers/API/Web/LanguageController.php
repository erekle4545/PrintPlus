<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Languages;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function index()
    {
        $languages = Languages::where('status', 1)->get();

        return response()->json([
            'success' => true,
            'data' => $languages
        ]);
    }

    public function getActive()
    {
        $languages = Languages::where('status', 1)
            ->orderBy('default', 'desc')
            ->get();

        $default = $languages->where('default', 1)->first();

        return response()->json([
            'success' => true,
            'data' => [
                'languages' => $languages,
                'default' => $default
            ]
        ]);
    }
}
