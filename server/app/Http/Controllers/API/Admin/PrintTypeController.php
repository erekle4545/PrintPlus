<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\PrintType;
use Illuminate\Http\Request;

class PrintTypeController extends Controller
{
    /**
     * @return mixed
     */
    public function index()
    {
        return PrintType::latest()->paginate(10);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $PrintType = PrintType::create($validated);

        return response()->json($PrintType, 201);
    }

    /**
     * @param PrintType $PrintType
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(PrintType $PrintType)
    {
        return response()->json($PrintType);
    }

    /**
     * @param Request $request
     * @param PrintType $PrintType
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, PrintType $PrintType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $PrintType->update($validated);
        return response()->json($PrintType);
    }

    public function destroy(PrintType $PrintType)
    {
        $PrintType->delete();
        return response()->json(null, 204);
    }
}
