<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\Size;
use Illuminate\Http\Request;

class SizesController extends Controller
{
    public function index()
    {
        return Size::latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'width' => 'required|integer|min:1',
            'height' => 'required|integer|min:1',
            'value' => 'required|string',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $size = Size::create($validated);
        return response()->json($size, 201);
    }

    public function show(Size $size)
    {
        return response()->json($size);
    }

    public function update(Request $request, Size $size)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'width' => 'required|integer|min:1',
            'height' => 'required|integer|min:1',
            'value' => 'required|string',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $size->update($validated);
        return response()->json($size);
    }

    public function destroy(Size $size)
    {
        $size->delete();
        return response()->json(null, 204);
    }

}
