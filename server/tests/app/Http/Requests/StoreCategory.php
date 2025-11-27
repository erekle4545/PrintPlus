<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Factory;

class StoreCategory extends FormRequest
{
    public function __construct(Factory $factory)
    {
        $factory->extend(
            'slug_is_unique',
            function ($attribute, $value, $parameters) {
                /**
                 * Find any page with parent id and slug on current level
                 */
                return Page::with('info')->whereHas('info', function ($query) {
                        $query->where(['slug' => $this->slug, 'language_id' => $this->language_id]);
                        if ($this->id) {
                            $query->where('category_id', '!=', $this->id);
                        }
                    })->get()->count() === 0;
            },
            'Provided slug already exists, choose different one'
        );    }

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
            'title'=>['text','required'],
            'status'        => ["required", "in:" . implode(",", config('page.status'))],
            'date'=>['date','required'],
            'language_id'   => ['required', 'exists:languages,id'],
            'cover_id'      => ['array', 'exists:files,id'],
            'slug' => ['required', 'slug_is_unique', 'regex:/^[a-zა-ჰа-я\d]+[a-zა-ჰа-я-_\d]+[a-zა-ჰа-я\d]$/iu'],
        ];
    }
}
