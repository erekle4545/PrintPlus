<?php

namespace App\Http\Controllers\API\Web\Cart;

use App\Http\Controllers\Controller;
use App\Models\Core\Cart;
use App\Models\Core\Cover;
use App\Models\Core\GuestCart;
use App\Models\Core\Products;
use App\Traits\GuestSessionTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    use GuestSessionTrait;

    private function getSessionId(Request $request)
    {
        return $this->getGuestSessionId($request);
    }

    private function isAuthenticated($request)
    {
        return auth('sanctum')->check();
    }

    public function index(Request $request)
    {
        if ($this->isAuthenticated($request)) {
            $cartItems = Cart::where('user_id', auth('sanctum')->id())
                ->with(['product' => function ($query) {
                    $query->select('id', 'price', 'sale_price');
                }])
                ->get();
        } else {
            $sessionId = $this->getSessionId($request);
            $cartItems = GuestCart::where('session_id', $sessionId)
                ->with(['product' => function ($query) {
                    $query->select('id', 'price', 'sale_price');
                }])
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $cartItems,
        ]);
    }

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
            'materials' => 'nullable|string|max:1000',
            'print_type' => 'nullable|string|max:1000',
            'extras' => 'nullable|array',
            'custom_dimensions' => 'nullable|array',
            'custom_dimensions.width' => 'nullable|numeric|min:0',
            'custom_dimensions.height' => 'nullable|numeric|min:0',
            'cover_id' => 'nullable|array',
            'cover_id.*' => 'nullable|integer|exists:files,id',
            'cover_type' => 'nullable|array',
            'cover_type.*' => 'string|in:image,video,pdf,file',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'შეცდომა ვალიდაციაში',
                'errors' => $validator->errors(),
            ], 422);
        }

        $product = Products::with('info')->findOrFail($request->product_id);

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

        if ($this->isAuthenticated($request)) {
            $existingCart = Cart::where('user_id', auth('sanctum')->id())
                ->where('product_id', $request->product_id)
                ->where('color', $request->color)
                ->where('size', $request->size)
                ->where('materials', $request->materials)
                ->where('print_type', $request->print_type)
                ->first();

            if ($existingCart) {
                $existingCart->update([
                    'quantity' => $existingCart->quantity + $request->quantity,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'პროდუქტი დაემატა კალათაში',
                    'data' => $existingCart,
                ]);
            }

            $cartItem = Cart::create([
                'user_id' => auth('sanctum')->id(),
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
            ]);

            $uploadedFiles = $request->uploaded_file;

            if (is_string($uploadedFiles)) {
                $uploadedFiles = json_decode($uploadedFiles, false); // array of objects
            }

            if (!empty($uploadedFiles) && is_array($uploadedFiles)) {
                $this->createCovers($cartItem, $uploadedFiles);
            }


        } else {
            $sessionId = $this->getSessionId($request);

            $existingCart = GuestCart::where('session_id', $sessionId)
                ->where('product_id', $request->product_id)
                ->where('color', $request->color)
                ->where('size', $request->size)
                ->where('materials', $request->materials)
                ->where('print_type', $request->print_type)
                ->first();

            if ($existingCart) {
                $existingCart->update([
                    'quantity' => $existingCart->quantity + $request->quantity,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'პროდუქტი დაემატა კალათაში',
                    'data' => $existingCart,
                ]);
            }

            $cartItem = GuestCart::create([
                'session_id' => $sessionId,
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
            ]);

            $uploadedFiles = $request->uploaded_file;

            if (is_string($uploadedFiles)) {
                $uploadedFiles = json_decode($uploadedFiles, false); // array of objects
            }

            if (!empty($uploadedFiles) && is_array($uploadedFiles)) {
                $this->createCovers($cartItem, $uploadedFiles);
            }
//            if ($request->has('cover_id') && is_array($request->cover_id)) {
//                $this->createCovers($cartItem, $request->cover_id, $request->cover_type);
//            }
        }

        return response()->json([
            'success' => true,
            'message' => 'პროდუქტი დაემატა კალათაში',
            'data' => $cartItem,
        ], 201);
    }

    private function createCovers($cartItem, array $coverIds, ?array $coverTypes = null)
    {
        foreach ($coverIds as $index => $file) {

            Cover::create([
                'coverable_id' => $cartItem->id,
                'coverable_type' => get_class($cartItem),
                'files_id' => $file->file_id,
                'cover_type' => 1,
                'quantity' =>$file->quantity ?? 1,
            ]);
        }
    }

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

        if ($this->isAuthenticated($request)) {
            $cartItem = Cart::where('user_id', auth('sanctum')->id())->findOrFail($id);
        } else {
            $sessionId = $this->getSessionId($request);
            $cartItem = GuestCart::where('session_id', $sessionId)->findOrFail($id);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'success' => true,
            'message' => 'რაოდენობა განახლდა',
            'data' => $cartItem,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if ($this->isAuthenticated($request)) {
            $cartItem = Cart::where('user_id', auth('sanctum')->id())->findOrFail($id);
        } else {
            $sessionId = $this->getSessionId($request);
            $cartItem = GuestCart::where('session_id', $sessionId)->findOrFail($id);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'პროდუქტი წაიშალა კალათიდან',
        ]);
    }

    public function clear(Request $request)
    {
        if ($this->isAuthenticated($request)) {
            Cart::where('user_id', auth('sanctum')->id())->delete();
        } else {
            $sessionId = $this->getSessionId($request);
            GuestCart::where('session_id', $sessionId)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'კალათა გასუფთავდა',
        ]);
    }

    public function stats(Request $request)
    {
        if ($this->isAuthenticated($request)) {
            $cartItems = Cart::where('user_id', auth('sanctum')->id())->get();
        } else {
            $sessionId = $this->getSessionId($request);
            $cartItems = GuestCart::where('session_id', $sessionId)->get();
        }

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

    public function mergeGuestCart(Request $request)
    {
        if (!$this->isAuthenticated($request)) {
            return response()->json([
                'success' => false,
                'message' => 'ავტორიზაცია საჭიროა',
            ], 401);
        }

        $sessionId = $this->getSessionId($request);
        $guestItems = GuestCart::where('session_id', $sessionId)->get();

        if ($guestItems->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'კალათა ცარიელია',
            ]);
        }

        foreach ($guestItems as $guestItem) {
            $existingCart = Cart::where('user_id',auth('sanctum')->id())
                ->where('product_id', $guestItem->product_id)
                ->where('color', $guestItem->color)
                ->where('size', $guestItem->size)
                ->where('materials', $guestItem->materials)
                ->where('print_type', $guestItem->print_type)
                ->first();

            if ($existingCart) {
                $existingCart->update([
                    'quantity' => $existingCart->quantity + $guestItem->quantity,
                ]);
            } else {
                $newCartItem = Cart::create([
                    'user_id' =>auth('sanctum')->id(),
                    'product_id' => $guestItem->product_id,
                    'name' => $guestItem->name,
                    'price' => $guestItem->price,
                    'quantity' => $guestItem->quantity,
                    'image' => $guestItem->image,
                    'discount' => $guestItem->discount,
                    'color' => $guestItem->color,
                    'size' => $guestItem->size,
                    'materials' => $guestItem->materials,
                    'print_type' => $guestItem->print_type,
                    'extras' => $guestItem->extras,
                    'custom_dimensions' => $guestItem->custom_dimensions,
                ]);

                $covers = Cover::where('coverable_id', $guestItem->id)
                    ->where('coverable_type', get_class($guestItem))
                    ->get();

                foreach ($covers as $cover) {
                    Cover::create([
                        'coverable_id' => $newCartItem->id,
                        'coverable_type' => get_class($newCartItem),
                        'files_id' => $cover->files_id,
                        'cover_type' => $cover->cover_type,
                    ]);
                }
            }
        }

        foreach ($guestItems as $guestItem) {
            Cover::where('coverable_id', $guestItem->id)
                ->where('coverable_type', get_class($guestItem))
                ->delete();
        }
        GuestCart::where('session_id', $sessionId)->delete();

        cookie()->queue(cookie()->forget('cart_session_id'));

        return response()->json([
            'success' => true,
            'message' => 'კალათა წარმატებით განახლდა',
            'merged_items' => $guestItems->count(),
        ]);
    }
}
