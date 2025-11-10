
<table style="border:3px solid #232323">
    <thead>
    <tr style="background-color: green;color:#ffffff;padding: 1rem;">
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" ># შეკვეთა</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >მისამართი</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >პროდუქცია</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >ტელეფონი</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >სახელი და გვარი</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >სოც. სახელი</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >ფასი</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >გადახდის სტატუსი</th>
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >კომენტარი</th>
{{--        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >მიწოდების ტიპი</th>--}}
        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >ოპერატორი</th>
        <th style="background-color: #f5be43;color:#232323;padding: 1rem;" >შეკვეთის თარიღი</th>
{{--        <th style="background-color: #1e7039;color:#ffffff;padding: 1rem;" >შექმნის თარიღი</th>--}}
    </tr>
    </thead>
    <tbody>

    @foreach($orders as $key => $order)
        @php
            $totalPriceArray = [];
        @endphp
        <tr style="border:3px solid #232323">
            <td style="border:3px solid #232323">{{ $order->delivery_type == config('order.delivery_types.tbilisi.id')?'T':'R'}}{{ $order->id }}</td>
            <td style="border:3px solid #232323">{{ $order->address }}</td>
            <td style="border:3px solid #232323">
                    @foreach($order['orderItems'] as $item)
                    {{$item['product']['title']}}, #{{$item['product']['code']}} (რაოდ: {{$item['qty']}} ) /
                        @php
                            $totalPriceArray[] = $item->total_price;
                        @endphp
                    @endforeach
            </td>
            <td style="border:3px solid #232323">{{ $order->phone }}</td>
            <td style="border:3px solid #232323">{{ $order->surname }}</td>
            <td style="border:3px solid #232323">{{$order->customer->social_name}}</td>
            <td style="border:3px solid #232323">{{$order->price}}
{{--                @php--}}
{{--                    if($order->price < config('order.delivery_prices.conditional.conditional') && $order->delivery_type == config('order.delivery_types.tbilisi.id'))--}}
{{--                      {--}}
{{--                        echo $order->price+ config('order.delivery_prices.tbilisi.price');--}}
{{--                      }elseif($order->price < config('order.delivery_prices.conditional.conditional') && $order->delivery_type == config('order.delivery_types.region.id'))--}}
{{--                      {--}}
{{--                        echo  $order->price+ config('order.delivery_prices.region.price');--}}
{{--                      }else{--}}
{{--                        echo  $order->price;--}}
{{--                      }--}}
{{--                @endphp--}}

            </td>
            <td style="border:3px solid #232323">
                @php
                    if(isset($order->payment_state)){
                        $payments = array_filter(array_values(config('order.payments_states')), function ($paymentStateRow) use($order) {
                                return $paymentStateRow["id"] ==  $order->payment_state;
                        });
                        foreach ($payments as $payment){
                            echo $payment['name'];
                        }
                   }
                @endphp
            </td>
            <td style="border:3px solid #232323">{{ $order->comments }}</td>
{{--            <td style="border:3px solid #232323">--}}
{{--                @php--}}
{{--                    if($order->delivery_type){--}}
{{--                       $deliveryTypes = array_filter(array_values(config('order.delivery_types')), function ($item) use($order) {--}}
{{--                                return $item["id"] ==  $order->delivery_type;--}}
{{--                         });--}}
{{--                         foreach ($deliveryTypes as $deliveryType){--}}
{{--                            echo $deliveryType['name'];--}}
{{--                        }--}}
{{--                    }--}}
{{--                @endphp--}}
{{--            </td>--}}
            <td style="border:3px solid #232323">{{ $order->employees->name }} / {{ $order->employees->phone }}</td>
            <td style="border:3px solid #232323;background-color: #f3cc80;">{{ $order->delivery_date   }}</td>
{{--            <td style="border:3px solid #232323">{{ $order->created_at   }}</td>--}}
        </tr>
    @endforeach
    </tbody>
</table>
