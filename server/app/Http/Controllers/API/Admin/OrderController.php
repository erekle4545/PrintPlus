<?php


namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Core\Order;
use App\Models\Core\OrderItem;
use App\Models\Core\Cover;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * ყველა შეკვეთის მიღება (ადმინისთვის)
     */
    public function index(Request $request)
    {
        // პაგინაციის პარამეტრები
        $perPage = $request->input('per_page', 15);
        $status = $request->input('status'); // ფილტრი სტატუსით
        $search = $request->input('search'); // ძებნა ნომრით, სახელით, ტელეფონით

        $query = Order::with(['items.product', 'items.covers', 'user'])
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
     * კონკრეტული შეკვეთის მიღება (ადმინისთვის)
     */
    public function show($id)
    {
        $order = Order::with(['items.product', 'items.covers', 'user'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * შეკვეთის სტატუსის განახლება (ადმინისთვის)
     */
    public function updateStatus(Request $request, $id)
    {
        // მივიღოთ ყველა ხელმისაწვდომი სტატუსი config-დან
        $allowedStatuses = array_keys(config('order.statuses'));

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:' . implode(',', $allowedStatuses),
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
            'message' => 'სტატუსი წარმატებით განახლდა',
            'data' => $order->load(['items.product', 'items.covers', 'user']),
        ]);
    }

    /**
     * ყველა სტატუსის მიღება (frontend-სთვის)
     */
    public function getStatuses()
    {
        return response()->json([
            'success' => true,
            'data' => config('order.statuses'),
        ]);
    }

    /**
     * შეკვეთის წაშლა (ადმინისთვის)
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $order = Order::findOrFail($id);

            // წავშალოთ შეკვეთის ყველა item-ის covers
            foreach ($order->items as $item) {
                Cover::where('coverable_type', OrderItem::class)
                    ->where('coverable_id', $item->id)
                    ->delete();
            }

            // წავშალოთ შეკვეთის items
            $order->items()->delete();

            // წავშალოთ შეკვეთა
            $order->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'შეკვეთა წარმატებით წაიშალა',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order deletion error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'შეკვეთის წაშლისას დაფიქსირდა შეცდომა',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * სტატისტიკა (ადმინისთვის)
     */
    public function statistics()
    {
        // config-დან მივიღოთ სტატუსები
        $statuses = config('order.statuses');

        $stats = [
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('status', 'delivered')->sum('total'),
            'pending_revenue' => Order::whereIn('status', ['pending', 'processing', 'shipped'])->sum('total'),
        ];

        // დინამიურად დავამატოთ თითოეული სტატუსის რაოდენობა
        foreach ($statuses as $key => $status) {
            $stats[$key . '_orders'] = Order::where('status', $key)->count();
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
