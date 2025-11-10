<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFilesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        $rules = [
            //file' => ['array','required','mimes:'.config('files.formats'),'max:204800'],
            'file' => ['required','max:'.config('files.size')],
            'w' => ['required','regex:/^\d+(\.\d+)?%?$/'], // 50,50% 50.56 დაფილტრავს Url-ს
            'h' => ['regex:/^\d+(\.\d+)?%?$/'],
            'folder_id'=>'exists:\App\Models\Folder,id'
        ];
        // $allRequestData  = $this->all();
//        foreach ($allRequestData['file'] as $file){
//            if(isset($file)&& $file instanceof UploadedFile){
//                $rules['file'][] = 'file';
//            }else{
//                $rules['file'][] = 'url';
//            }
//        }
        return $rules;
    }

    public function messages()
    {
        return [
            'w.regex'=>'Please specify width as a valid number in pixels or in %',
            'h.regex'=>'Please specify width as a valid number in pixels or in %',
        ];
    }

}
