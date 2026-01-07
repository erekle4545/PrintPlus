<?php

namespace App\Http\Controllers\API\Web\Order;

use App\Http\Controllers\Controller;
use App\Models\Core\OrderItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * ყველა შეკვეთის მიღება (ავტორიზებული მომხმარებლის)
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
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
            ->with('items.product')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * ახალი შეკვეთის შექმნა
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:cash,card,bank_transfer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
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

            // შევქმნათ შეკვეთა
            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => $this->generateOrderNumber(),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'notes' => $request->notes,
                'payment_method' => $request->payment_method,
                'subtotal' => $request->total,
                'delivery_cost' => 0, // უფასო მიწოდება
                'total' => $request->total,
                'status' => 'pending',
            ]);

            // დავამატოთ შეკვეთის პროდუქტები
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'color' => $item['color'] ?? null,
                    'size' => $item['size'] ?? null,
                    'extras' => isset($item['extras']) ? json_encode($item['extras']) : null,
                    'materials' => isset($item['extras']) ? json_encode($item['materials']) : null,
                    'custom_dimensions' => isset($item['custom_dimensions']) ? json_encode($item['custom_dimensions']) : null,
                    'uploaded_file' => $item['uploaded_file'] ?? null,
                ]);
            }

            DB::commit();

            // გამოვგზავნოთ შეტყობინება ელ-ფოსტაზე (ოფციონალური)
            // Mail::to($order->email)->send(new OrderConfirmation($order));

            return response()->json([
                'success' => true,
                'message' => 'შეკვეთა წარმატებით შეიქმნა',
                'data' => $order->load('items'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'შეკვეთის შექმნისას დაფიქსირდა შეცდომა',
                'error' => $e->getMessage(),
            ], 500);
        }
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
     * შეკვეთის ნომრის გენერაცია
     */
    private function generateOrderNumber()
    {
        return 'ORD-' . strtoupper(uniqid());
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
