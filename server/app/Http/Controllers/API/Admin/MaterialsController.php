<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Models\Core\Cover;
use App\Models\Core\Material;
use Illuminate\Http\Request;

class MaterialsController extends Controller
{

    /**
     * @return mixed
     */
    public function index()
    {
        return Material::query()->with('covers')->latest()->paginate(10);
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


        $material = Material::create($validated);

        if($request->cover_id) {
            /**
             *  covers
             */
            foreach ($request->cover_id as $key => $value) {
                Cover::Create([
                    'files_id'        => $value,
                    'cover_type'     => $request->cover_type[$key],
                    'coverable_type' => Multitenant::getModel('Material'),
                    'coverable_id'   => $material->id,
                ]);
            }
        }


        return response()->json($material, 201);
    }

    /**
     * @param Material $material
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Material $material)
    {
        return response()->json($material);
    }

    /**
     * @param Request $request
     * @param Material $material
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'nullable|numeric|min:0'
        ]);

        $material->update($validated);

        /**
         * Attach covers
         */
        if ($material->id) {
            $coverModel = Multitenant::getModel('Cover');

            // Delete old covers
            $coverModel::where('coverable_type', Multitenant::getModel('Material'))
                ->where('coverable_id', $material->id)
                ->delete();

            // Add new covers
            if ($request->has('cover_id') && is_array($request->cover_id)) {
                foreach ($request->cover_id as $key => $value) {
                    if ($value) { // Check if value exists
                        $coverModel::create([
                            'files_id'        => $value,
                            'cover_type'      => $request->cover_type[$key] ?? 1,
                            'coverable_type'  => Multitenant::getModel('Material'),
                            'coverable_id'    => $material->id,
                        ]);
                    }
                }
            }
        }

        // Reload material with covers
        $material->load('covers');

        return response()->json($material);
    }

    /**
     * @param Material $material
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Material $material)
    {
        $material->delete();

        return response()->json(null, 204);
    }
}
