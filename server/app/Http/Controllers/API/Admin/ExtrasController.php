<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\Extra;
use Illuminate\Http\Request;

class ExtrasController extends Controller
{
    public function index()
    {
        return Extra::latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $extra = Extra::create($validated);
        return response()->json($extra, 201);
    }

    public function show(Extra $extra)
    {
        return response()->json($extra);
    }

    public function update(Request $request, Extra $extra)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $extra->update($validated);
        return response()->json($extra);
    }

    public function destroy(Extra $extra)
    {
        $extra->delete();
        return response()->json(null, 204);
    }
}
