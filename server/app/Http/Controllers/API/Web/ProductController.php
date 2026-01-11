<?php

    namespace App\Http\Controllers\API\Web;

    use App\Helpers\Core\Multitenant;
    use App\Http\Controllers\Controller;
    use App\Models\Core\Products;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {

        $data = $request->validate([
            'category_id' => 'required|integer',
            'language_id' => 'required|integer|exists:languages,id',
        ],[
            'category_id' => 'კატეგორიის არჩევა აუცილებელია'
        ]);

        //if not isset category in categories table
        $categoryExists = DB::table('categories')
            ->where('id', $data['category_id'])
            ->exists();

        if (!$categoryExists) {
            return response()->json([], 200);
        }

        $products = Products::query()
            ->where('category_id', $data['category_id'])
            ->with([
                'info' => function($q) use ($data) {
                    $q->where('language_id', $data['language_id'])
                        ->with('covers');
                },
                'colors',
                'sizes',
                'extras',
                'materials.covers',
                'printTypes',
                'category.page:id,template_id',
                'category.info' => function($q) use ($data) {
                    $q->where('language_id', $data['language_id'])
                        ->select('id', 'category_id', 'slug', 'title');
                }
            ])
            ->get()
            ->map(function ($product) {

                $info = $product->info;

                // თუ გინდა "ბრტყლად" გადატანა:
                $product->title = $info?->title;
                $product->description = $info?->description;
                $product->slug = $info?->slug;
                $product->covers = $info?->covers ?? collect([]);

                // თუ გინდა info-ც დარჩეს:
                // არ შლი info-ს

                // Colors
                $product->colors = $product->colors->map(fn ($color) => [
                    'id' => $color->id,
                    'name' => $color->name,
                    'value' => $color->value,
                    'type' => $color->type,
                    'base_price' => $color->base_price,
                    'price' => $color->pivot->price ?? $color->base_price
                ]);

                // Sizes
                $product->sizes = $product->sizes->map(fn ($size) => [
                    'id' => $size->id,
                    'info' => [
                        'title' => $size->name ?? '',
                        'description' => $size->description ?? '',
                    ],
                    'value' => $size->value,
                    'width' => $size->width,
                    'height' => $size->height,
                    'base_price' => $size->base_price,
                    'price' => $size->pivot->price ?? $size->base_price
                ]);

                // Materials
                $product->materials = $product->materials->map(fn ($material) => [
                    'id' => $material->id,
                    'name' => $material->name,
                    'base_price' => $material->base_price,
                    'price' => $material->pivot->price ?? $material->base_price,
                    'covers' => $material->covers
                ]);

                // Print Types
                $product->print_types = $product->printTypes->map(fn ($printType) => [
                    'id' => $printType->id,
                    'name' => $printType->name,
                    'base_price' => $printType->base_price,
                    'price' => $printType->pivot->price ?? $printType->base_price
                ]);
                unset($product->printTypes);

                // Extras
                $product->extras = $product->extras->map(fn ($extra) => [
                    'id' => $extra->id,
                    'name' => $extra->name,
                    'base_price' => $extra->base_price,
                    'price' => $extra->pivot->price ?? $extra->base_price
                ]);

                return $product;
            });

        return response()->json($products);


     }


    /**
     * @param Request $request
     * @param $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function show( Request $request){

        $model = Multitenant::getModel('Products');

        $slug = $request->get('slug');


        try {

            if(preg_match('/-pr(\d+)$/', $slug, $matches)) {

                $id = $matches[1];
                //Find page with id and language id
                $Products = $model::with([
                    'info' => function ($query) use ($request) {
                        $query->where('language_id', $request->language_id ?? 1);
                    },
                    'info.covers',
                    'colors',
                    'sizes',
                    'category.page:id,template_id',
                    'category.info:id,category_id,slug,title',
                    'materials.covers',
                    'printTypes',
                    'extras'
                ])->findOrFail($id);

                //if we can not find Category with id and language, select very first Category ignoring Language
                if (is_null($Products->info)) {
                    $Products = $model::with(['info', 'info.covers', 'colors', 'sizes','materials.covers', 'printTypes', 'extras'])->findOrFail($id);
                }

                // Format attributes for frontend
                $productAttributes = [
                    'colors' => $Products->colors->map(function ($color) {
                        return [
                            'id' => $color->id,
                            'name' => $color->name,
                            'value' => $color->value,
                            'type' => $color->type,
                            'base_price' => $color->base_price,
                            'custom_price' => $color->pivot->price
                        ];
                    })->toArray(),
                    'sizes' => $Products->sizes->map(function ($size) {
                        return [
                            'id' => $size->id,
                            'name' => $size->name,
                            'value' => $size->value,
                            'width' => $size->width,
                            'height' => $size->height,
                            'base_price' => $size->base_price,
                            'custom_price' => $size->pivot->price
                        ];
                    })->toArray(),
                    'materials' => $Products->materials->map(function ($material) {
                        return [
                            'id' => $material->id,
                            'name' => $material->name,
                            'base_price' => $material->base_price,
                            'custom_price' => $material->pivot->price,
                            'covers' => $material->covers
                        ];
                    })->toArray(),
                    'print_types' => $Products->printTypes->map(function ($printType) {
                        return [
                            'id' => $printType->id,
                            'name' => $printType->name,
                            'base_price' => $printType->base_price,
                            'custom_price' => $printType->pivot->price
                        ];
                    })->toArray(),
                    'extras' => $Products->extras->map(function ($extra) {
                        return [
                            'id' => $extra->id,
                            'name' => $extra->name,
                            'base_price' => $extra->base_price,
                            'custom_price' => $extra->pivot->price
                        ];
                    })->toArray(),
                ];

                $Products->product_attributes = $productAttributes;

                return response()->json($Products);

            }else{
                return response()->json(['message' => 'not found'], 404);
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'not found'], 404);
        }

    }
}
