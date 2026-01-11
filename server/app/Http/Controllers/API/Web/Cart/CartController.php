<?php


namespace App\Http\Controllers\API\Web\Cart;

use App\Http\Controllers\Controller;
use App\Models\Core\Cart;
use App\Models\Core\Cover;
use App\Models\Core\GuestCart;
use App\Models\Core\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get session ID for guest users
     */
    private function getSessionId(Request $request)
    {
        // Start session if not started
        if (!$request->session()->has('cart_session')) {
            $request->session()->put('cart_session', $request->session()->getId());
        }

        return $request->session()->get('cart_session');
    }

    /**
     * Check if user is authenticated
     */
    private function isAuthenticated(Request $request)
    {
        return $request->user() !== null;
    }

    /**
     * კალათის შიგთავსის მიღება
     */
    public function index(Request $request)
    {
        if ($this->isAuthenticated($request)) {
            // Authenticated user cart
            $cartItems = Cart::where('user_id', $request->user()->id)
                ->with(['product' => function ($query) {
                    $query->select('id', 'price', 'sale_price');
                }])
                ->get();
        } else {
            // Guest cart
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
            'materials' => 'nullable|string|max:1000',
            'print_type' => 'nullable|string|max:1000',
            'extras' => 'nullable|array',
            'custom_dimensions' => 'nullable|array',
            'custom_dimensions.width' => 'nullable|numeric|min:0',
            'custom_dimensions.height' => 'nullable|numeric|min:0',
            'uploaded_file' => 'nullable|string',
            // files
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

        if ($this->isAuthenticated($request)) {
            //  Authenticated user - Cart table
            $existingCart = Cart::where('user_id', $request->user()->id)
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

            if ($request->has('cover_id') && is_array($request->cover_id)) {
                $this->createCovers($cartItem, $request->cover_id, $request->cover_type);
            }

        } else {
            // ✅ Guest user - GuestCart table
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
                'uploaded_file' => $request->uploaded_file,
            ]);

            // შექმენი Cover records (guest user)
            if ($request->has('cover_id') && is_array($request->cover_id)) {
                $this->createCovers($cartItem, $request->cover_id, $request->cover_type);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'პროდუქტი დაემატა კალათაში',
            'data' => $cartItem,
        ], 201);
    }

    // Helper method Cover records
    private function createCovers($cartItem, array $coverIds, ?array $coverTypes = null)
    {

        foreach ($coverIds as $index => $fileId) {

            Cover::create([
                'coverable_id' => $cartItem->id,
                'coverable_type' =>Cart::class,
                'files_id' => $fileId,
                'cover_type' => 1,
            ]);
        }


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

        if ($this->isAuthenticated($request)) {
            $cartItem = Cart::where('user_id', $request->user()->id)->findOrFail($id);
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

    /**
     * კალათიდან პროდუქტის წაშლა
     */
    public function destroy(Request $request, $id)
    {
        if ($this->isAuthenticated($request)) {
            $cartItem = Cart::where('user_id', $request->user()->id)->findOrFail($id);
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

    /**
     * კალათის გასუფთავება
     */
    public function clear(Request $request)
    {
        if ($this->isAuthenticated($request)) {
            Cart::where('user_id', $request->user()->id)->delete();
        } else {
            $sessionId = $this->getSessionId($request);
            GuestCart::where('session_id', $sessionId)->delete();
        }

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
        if ($this->isAuthenticated($request)) {
            $cartItems = Cart::where('user_id', $request->user()->id)->get();
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

    /**
     * Merge guest cart to user cart after login
     */
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
            $existingCart = Cart::where('user_id', $request->user()->id)
                ->where('product_id', $guestItem->product_id)
                ->where('color', $guestItem->color)
                ->where('size', $guestItem->size)
                ->where('materials', $guestItem->materials)
                ->where('print_type', $guestItem->print_type)
                ->first();

            if ($existingCart) {
                // Update quantity
                $existingCart->update([
                    'quantity' => $existingCart->quantity + $guestItem->quantity,
                ]);
            } else {
                // Create new cart item
                Cart::create([
                    'user_id' => $request->user()->id,
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
                    'uploaded_file' => $guestItem->uploaded_file,
                ]);
            }
        }

        // Delete guest cart items
        GuestCart::where('session_id', $sessionId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'კალათა წარმატებით განახლდა',
            'merged_items' => $guestItems->count(),
        ]);
    }
}

//
//namespace App\Http\Controllers\API\Web\Cart;
//
//use App\Http\Controllers\Controller;
//use App\Models\Core\Cart;
//use App\Models\Core\Products;
//use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Validator;
//
//class CartController extends Controller
//{
//    /**
//     * კალათის შიგთავსის მიღება
//     */
//    public function index(Request $request)
//    {
//        $cartItems = Cart::where('user_id', $request->user()->id)
//            ->with('product')
//            ->get();
//
//        return response()->json([
//            'success' => true,
//            'data' => $cartItems,
//        ]);
//    }
//
//    /**
//     * პროდუქტის დამატება კალათში
//     */
//    public function store(Request $request)
//    {
//
//        $validator = Validator::make($request->all(), [
//            'product_id' => 'required|exists:products,id',
//            'name' => 'nullable|string|max:255',
//            'quantity' => 'required|integer|min:1',
//            'price' => 'required|numeric|min:0',
//            'image' => 'nullable|string',
//            'discount' => 'nullable|numeric|min:0|max:100',
//            'color' => 'nullable|string|max:100',
//            'size' => 'nullable|string|max:100',
//            'extras' => 'nullable|array',
//            'materials' => 'nullable|string|max:1000',
//            'print_type' => 'nullable|string|max:1000',
//            'custom_dimensions' => 'nullable|array',
//            'custom_dimensions.width' => 'nullable|numeric|min:0',
//            'custom_dimensions.height' => 'nullable|numeric|min:0',
//            'uploaded_file' => 'nullable|string',
//        ]);
//
//        if ($validator->fails()) {
//            return response()->json([
//                'success' => false,
//                'message' => 'შეცდომა ვალიდაციაში',
//                'errors' => $validator->errors(),
//            ], 422);
//        }
//
//        $product = Products::with('info')->findOrFail($request->product_id);
//
//        // პროდუქტის სახელის მიღება
//        $productName = $request->name;
//        if (!$productName) {
//            if (isset($product->info) && isset($product->info->name)) {
//                $productName = $product->info->name;
//            } elseif (isset($product->name)) {
//                $productName = $product->name;
//            } else {
//                $productName = 'პროდუქტი #' . $product->id;
//            }
//        }
//
//        // შევამოწმოთ არსებობს თუ არა იგივე პროდუქტი იგივე პარამეტრებით
//        $existingCart = Cart::where('user_id', $request->user()->id)
//            ->where('product_id', $request->product_id)
//            ->where('color', $request->color)
//            ->where('size', $request->size)
//            ->first();
//
//        if ($existingCart) {
//            // თუ არსებობს, განვაახლოთ რაოდენობა
//            $existingCart->update([
//                'quantity' => $existingCart->quantity + $request->quantity,
//            ]);
//
//            return response()->json([
//                'success' => true,
//                'message' => 'პროდუქტი დაემატა კალათაში',
//                'data' => $existingCart,
//            ]);
//        }
//
//        // შევქმნათ ახალი ჩანაწერი
//        $cartItem = Cart::create([
//            'user_id' => $request->user()->id,
//            'product_id' => $request->product_id,
//            'name' => $productName,
//            'price' => $request->price,
//            'quantity' => $request->quantity,
//            'image' => $request->image,
//            'discount' => $request->discount,
//            'color' => $request->color,
//            'size' => $request->size,
//            'materials' => $request->materials,
//            'print_type' => $request->print_type,
//            'extras' => $request->extras ? json_encode($request->extras) : null,
//            'custom_dimensions' => $request->custom_dimensions ? json_encode($request->custom_dimensions) : null,
//            'uploaded_file' => $request->uploaded_file,
//        ]);
//
//        return response()->json([
//            'success' => true,
//            'message' => 'პროდუქტი დაემატა კალათაში',
//            'data' => $cartItem,
//        ], 201);
//    }
//
//    /**
//     * კალათის ელემენტის რაოდენობის განახლება
//     */
//    public function update(Request $request, $id)
//    {
//        $validator = Validator::make($request->all(), [
//            'quantity' => 'required|integer|min:1',
//        ]);
//
//        if ($validator->fails()) {
//            return response()->json([
//                'success' => false,
//                'message' => 'შეცდომა ვალიდაციაში',
//                'errors' => $validator->errors(),
//            ], 422);
//        }
//
//        $cartItem = Cart::where('user_id', $request->user()->id)
//            ->findOrFail($id);
//
//        $cartItem->update([
//            'quantity' => $request->quantity,
//        ]);
//
//        return response()->json([
//            'success' => true,
//            'message' => 'რაოდენობა განახლდა',
//            'data' => $cartItem,
//        ]);
//    }
//
//    /**
//     * კალათიდან პროდუქტის წაშლა
//     */
//    public function destroy(Request $request, $id)
//    {
//        $cartItem = Cart::where('user_id', $request->user()->id)
//            ->findOrFail($id);
//
//        $cartItem->delete();
//
//        return response()->json([
//            'success' => true,
//            'message' => 'პროდუქტი წაიშალა კალათიდან',
//        ]);
//    }
//
//    /**
//     * კალათის გასუფთავება
//     */
//    public function clear(Request $request)
//    {
//        Cart::where('user_id', $request->user()->id)->delete();
//
//        return response()->json([
//            'success' => true,
//            'message' => 'კალათა გასუფთავდა',
//        ]);
//    }
//
//    /**
//     * კალათის სტატისტიკა
//     */
//    public function stats(Request $request)
//    {
//        $cartItems = Cart::where('user_id', $request->user()->id)->get();
//
//        $totalItems = $cartItems->sum('quantity');
//        $totalPrice = $cartItems->sum(function ($item) {
//            return $item->price * $item->quantity;
//        });
//
//        return response()->json([
//            'success' => true,
//            'data' => [
//                'total_items' => $totalItems,
//                'total_price' => round($totalPrice, 2),
//            ],
//        ]);
//    }
//}
