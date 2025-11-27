<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateRealtor extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [

            'companyName' => 'required|string|max:1000',
            'id_number'=>'required',
            'phone'=>'required',
            'address'=>'required|string',
            'date'=>'required|date'
        ];
    }
}
