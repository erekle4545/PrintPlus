<?php


namespace App\Http\Controllers\API\Web\Order;

use App\Http\Controllers\Controller;
use App\Models\Core\Order;
use App\Models\Core\OrderItem;
use App\Models\Core\Cover;
use App\Models\Core\Cart;
use App\Models\Core\GuestCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * ახალი შეკვეთის შექმნა
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string|max:500',
            'city_id' => 'required|integer',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:cash,card,bank_transfer',
            'cart_ids' => 'required|array|min:1', // Cart IDs instead of items
            'cart_ids.*' => 'required|integer',
            'total' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'შეცდომა ვალიდაციაში',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Get city name from config
            $cities = config('order.cities');
            $cityName = null;

            foreach ($cities as $city) {
                if ($city['id'] == $request->city_id) {
                    $cityName = $city['name'];
                    break;
                }
            }

            // Check if user is authenticated
            $userId = auth()->check() ? auth()->id() : null;
            $sessionId = !auth()->check() ? session()->getId() : null;

            // Get cart items
            if ($userId) {
                $cartItems = Cart::whereIn('id', $request->cart_ids)
                    ->where('user_id', $userId)
                    ->with('product')
                    ->get();
            } else {
                $cartItems = GuestCart::whereIn('id', $request->cart_ids)
                    ->where('session_id', $sessionId)
                    ->with('product')
                    ->get();
            }

            if ($cartItems->isEmpty()) {
                throw new \Exception('კალათა ცარიელია');
            }

            // შევქმნათ შეკვეთა
            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $this->generateOrderNumber(),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $cityName,
                'city_id' => $request->city_id,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'notes' => $request->notes,
                'payment_method' => $request->payment_method,
                'subtotal' => $request->total,
                'delivery_cost' => 0,
                'total' => $request->total,
                'status' => 'pending',
            ]);

            // დავამატოთ შეკვეთის პროდუქტები Cart-დან
            foreach ($cartItems as $cartItem) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'name' => $cartItem->name,
                    'price' => $cartItem->price,
                    'quantity' => $cartItem->quantity,
                    'color' => $cartItem->color,
                    'size' => $cartItem->size,
                    'extras' => $cartItem->extras,
                    'materials' => $cartItem->materials,
                    'print_type' => $cartItem->print_type,
                    'custom_dimensions' => $cartItem->custom_dimensions,
//                    'uploaded_file' => $cartItem->uploaded_file,
                ]);

                // Copy covers from Cart to OrderItem
                $this->copyCoversFromCart($cartItem, $orderItem);
            }

            // Delete cart items after successful order
            if ($userId) {
                Cart::whereIn('id', $request->cart_ids)
                    ->where('user_id', $userId)
                    ->delete();
            } else {
                GuestCart::whereIn('id', $request->cart_ids)
                    ->where('session_id', $sessionId)
                    ->delete();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'შეკვეთა წარმატებით შეიქმნა',
                'data' => $order->load(['items.covers']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'შეკვეთის შექმნისას დაფიქსირდა შეცდომა',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Copy covers from Cart/GuestCart to OrderItem
     */
    private function copyCoversFromCart($cartItem, $orderItem)
    {
        // Get covers from cart
        $covers = Cover::where('coverable_id', $cartItem->id)
            ->where('coverable_type', get_class($cartItem))
            ->get();

        // Copy to order item
        foreach ($covers as $cover) {
            Cover::create([
                'coverable_id' => $orderItem->id,
                'coverable_type' => OrderItem::class,
                'files_id' => $cover->files_id,
                'cover_type' => $cover->cover_type,
            ]);
        }
        // delete  cart cover
        if (!is_null($cartItem->id)) {
            Cover::where('coverable_type', get_class($cartItem))->where('coverable_id', $cartItem->id)->delete();
        }
    }

    /**
     * შეკვეთის ნომრის გენერაცია
     */
    private function generateOrderNumber()
    {
        return 'ORD-' . strtoupper(uniqid());
    }

    /**
     * ყველა შეკვეთის მიღება
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product', 'items.covers'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * კონკრეტული შეკვეთის მიღება
     */
    public function show(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with(['items.product', 'items.covers'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * შეკვეთის სტატუსის განახლება
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'შეცდომა ვალიდაციაში',
                'errors' => $validator->errors(),
            ], 422);
        }

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'სტატუსი განახლდა',
            'data' => $order,
        ]);
    }

    /**
     * შეკვეთის გაუქმება
     */
    public function cancel(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('status', '!=', 'delivered')
            ->findOrFail($id);

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'შეკვეთა გაუქმდა',
            'data' => $order,
        ]);
    }
}

