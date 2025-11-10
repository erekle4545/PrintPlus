<?php

namespace App\Exports;

use App\Models\Orders;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromView;
class InvoicesExport implements FromView
{

    protected $id = null;
    public  $date_picker =null;
    public  $delivery_type =null;

    public function __construct($id,$date_picker,$delivery_type)
    {
        $this->id = $id;

        $this->date_picker = $date_picker;
        $this->delivery_type = $delivery_type;

    }

    public function view(): View
    {
        $order = Orders::query();

        if($this->id){
            $order->where('id',$this->id);
        }

        if($this->delivery_type){
            $order->where('delivery_type',$this->delivery_type);
        }
        if($this->date_picker){
            $order->whereBetween('delivery_date', [Carbon::parse($this->date_picker[0])->startOfDay(), Carbon::parse($this->date_picker[1])->endOfDay()]);
        }



        $order->with(['orderItems.product'=> function ($query){
            $query->select('code','id','title');
        },'employees','customer']);

        return view('exports.exportOrders', [
            'orders' => $order->get()
        ]);

    }
}
