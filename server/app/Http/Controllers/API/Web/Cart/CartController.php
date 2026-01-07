<?php

namespace App\Http\Controllers\API\Web\Cart;

use App\Http\Controllers\Controller;
use App\Models\Core\Cart;
use App\Models\Core\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * კალათის შიგთავსის მიღება
     */
    public function index(Request $request)
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cartItems,
        ]);
    }

    /**
     * პროდუქტის დამატება კალათში
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'name' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0|max:100',
            'color' => 'nullable|string|max:100',
            'size' => 'nullable|string|max:100',
            'extras' => 'nullable|array',
            'materials' => 'nullable|string|max:1000',
            'print_type' => 'nullable|string|max:1000',
            'custom_dimensions' => 'nullable|array',
            'custom_dimensions.width' => 'nullable|numeric|min:0',
            'custom_dimensions.height' => 'nullable|numeric|min:0',
            'uploaded_file' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'შეცდომა ვალიდაციაში',
                'errors' => $validator->errors(),
            ], 422);
        }

        $product = Products::with('info')->findOrFail($request->product_id);

        // პროდუქტის სახელის მიღება
        $productName = $request->name;
        if (!$productName) {
            if (isset($product->info) && isset($product->info->name)) {
                $productName = $product->info->name;
            } elseif (isset($product->name)) {
                $productName = $product->name;
            } else {
                $productName = 'პროდუქტი #' . $product->id;
            }
        }

        // შევამოწმოთ არსებობს თუ არა იგივე პროდუქტი იგივე პარამეტრებით
        $existingCart = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->where('color', $request->color)
            ->where('size', $request->size)
            ->first();

        if ($existingCart) {
            // თუ არსებობს, განვაახლოთ რაოდენობა
            $existingCart->update([
                'quantity' => $existingCart->quantity + $request->quantity,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'პროდუქტი დაემატა კალათაში',
                'data' => $existingCart,
            ]);
        }

        // შევქმნათ ახალი ჩანაწერი
        $cartItem = Cart::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'name' => $productName,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'image' => $request->image,
            'discount' => $request->discount,
            'color' => $request->color,
            'size' => $request->size,
            'materials' => $request->materials,
            'print_type' => $request->print_type,
            'extras' => $request->extras ? json_encode($request->extras) : null,
            'custom_dimensions' => $request->custom_dimensions ? json_encode($request->custom_dimensions) : null,
            'uploaded_file' => $request->uploaded_file,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'პროდუქტი დაემატა კალათაში',
            'data' => $cartItem,
        ], 201);
    }

    /**
     * კალათის ელემენტის რაოდენობის განახლება
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'შეცდომა ვალიდაციაში',
                'errors' => $validator->errors(),
            ], 422);
        }

        $cartItem = Cart::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'რაოდენობა განახლდა',
            'data' => $cartItem,
        ]);
    }

    /**
     * კალათიდან პროდუქტის წაშლა
     */
    public function destroy(Request $request, $id)
    {
        $cartItem = Cart::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'პროდუქტი წაიშალა კალათიდან',
        ]);
    }

    /**
     * კალათის გასუფთავება
     */
    public function clear(Request $request)
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'კალათა გასუფთავდა',
        ]);
    }

    /**
     * კალათის სტატისტიკა
     */
    public function stats(Request $request)
    {
        $cartItems = Cart::where('user_id', $request->user()->id)->get();

        $totalItems = $cartItems->sum('quantity');
        $totalPrice = $cartItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'total_items' => $totalItems,
                'total_price' => round($totalPrice, 2),
            ],
        ]);
    }
}
