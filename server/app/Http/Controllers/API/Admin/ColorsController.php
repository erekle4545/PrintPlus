<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\Color;
use Illuminate\Http\Request;

class ColorsController extends Controller
{

    public function index()
    {
        return Color::latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'value' => 'required|string',
            'type' => 'required|in:word,gradient',
            'colors' => 'nullable|array',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $color = Color::create($validated);

        return response()->json($color, 201);
    }

    public function show(Color $color)
    {
        return response()->json($color);
    }

    public function update(Request $request, Color $color)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'value' => 'required|string',
            'type' => 'required|in:word,gradient',
            'colors' => 'nullable|array',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $color->update($validated);
        return response()->json($color);
    }

    public function destroy(Color $color)
    {
        $color->delete();
        return response()->json(null, 204);
    }
}
