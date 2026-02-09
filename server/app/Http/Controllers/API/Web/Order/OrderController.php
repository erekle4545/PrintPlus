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

    public function index(Request $request)
    {
        // პაგინაციის პარამეტრები
        $perPage = $request->input('per_page', 15);
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Order::where('user_id', $request->user()->id)->with(['items.product', 'items.covers', 'user'])
            ->orderBy('created_at', 'desc');

        // სტატუსის ფილტრი
        if ($status) {
            $query->where('status', $status);
        }

        // ძებნა
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }
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
        // Get last order and increment
        $lastOrder = Order::latest('id')->first();
        $nextNumber = $lastOrder ? ((int)$lastOrder->order_number) + 1 : 1;

        // Pad to 6 digits: 000001, 000002, etc.
        $orderNumber = str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

        // Safety check
        while (Order::where('order_number', $orderNumber)->exists()) {
            $nextNumber++;
            $orderNumber = "ORD-".str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
        }

        return $orderNumber;
    }



    /**
     * კონკრეტული შეკვეთის მიღება
     */
    public function show($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with([
                'items.product',
                'items.covers',
                'user',
                'transactions' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                }])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'name' => $order->name,
                'phone' => $order->phone,
                'email' => $order->email,
                'address' => $order->address,
                'city' => $order->city,
                'notes' => $order->notes,
                'total' => (float) $order->total,
                'payment_method' =>$order->payment_method,
                'delivery_cost' =>$order->delivery_cost,
                'subtotal' =>$order->subtotal,
                'payment_status' => $order->payment_status,
                'payment_status_color' => $order->payment_status_color,
                'payment_status_label' => $order->payment_status_label,
                'status_color' => $order->status_color,
                'status_label' => $order->status_label,
//                'transaction_id' => $order->transaction_id,
                'created_at' => $order->created_at->toISOString(),
                'items' => $order->items->map(function ($item) {
                    return [
                         'name' => $item->name ?? 'N/A',
                        'quantity' => $item->quantity,
                        'price' => (float) $item->price,
                        'product'=>$item->product,
                        'covers'=>$item->covers,
                        'total' => (float) ($item->price * $item->quantity),
                    ];
                }),
            ],
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

