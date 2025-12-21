<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\Core\Products;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function index(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'language_id' => 'required|integer|exists:languages,id',
        ],[
            'category_id'=>'კატეგორიის არჩევა აუცილებელია'
        ]);

        $product = Products::query()
            ->where('category_id',$data['category_id'])
            ->with('info',function($query) use ($request){
            $query->where('language_id',$request->language_id);
            $query->with('covers');
        })->get();

        return response()->json($product);
    }
}
