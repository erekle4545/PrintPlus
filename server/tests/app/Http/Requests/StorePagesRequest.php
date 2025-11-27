<?php

namespace App\Http\Requests;

use App\Models\Core\Page;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Factory;

class StorePagesRequest extends FormRequest
{


    /**
     * @param Factory $factory
     */
    public function __construct(Factory $factory)
    {
        $factory->extend(
            'template_id_exists',
            function ($attribute, $value, $parameters) {
                $types = collect(config('page.templates'))->filter(function ($type) {
                    return $type['id'] == $this->template_id;
                });
                return $types->count() > 0;
            },
            'Provided template is incorrect'
        );

        $factory->extend(
            'slug_is_unique',
            function ($attribute, $value, $parameters) {
                /**
                 * Find any page with parent id and slug on current level
                 */
                return Page::with('info')->whereHas('info', function ($query) {
                        $query->where(['slug' => $this->slug, 'language_id' => $this->language_id]);
                        if ($this->id) {
                            $query->where('page_id', '!=', $this->id);
                        }
                    })->get()->count() === 0;
            },
            'Provided slug already exists, choose different one'
        );

//        $factory->extend(
//            'template_id_exists',
//            function ($attribute, $value, $parameters) {
//                $type = collect(config('page.types'))->filter(function ($type) {
//                    return $type['id'] == $this->type;
//                });
//
//                if ($type->count()) {
//                    $templates = collect(config('page.templates')[key($type->toArray())]);
//                    //dd($this->template_id);
//
//                    $template = $templates->filter(function ($template) {
//                        return $template['id'] == $this->template_id;
//                    });
//                    return $template->count() > 0;
//                }
//
//                return false;
//            },
//            'Provided template id is incorrect'
//        );
    }
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
     * [messages description]
     * @return [type] [description]
     */
    public function messages()
    {
        return [
            'status.required'       => sprintf('Status is required, available values are [%s]', implode(',', config('page.status'))),
            'status.in'             => sprintf('Incorrect value %s, available values are [%s]', $this->status, implode(',', config('page.status'))),
            'language_id.required'  => 'Language ID is required',
            'language_id.exists'    => sprintf('Provided language id %s is incorrect', $this->language_id),
            'title.required'        => 'Title is required',
            'slug.required'         => 'Slug is required',
            'slug.regex'            => 'Slug contains disallowed characters',
            'cover_id.required'     => 'Cover is required',
            'cover_id.exists'       => 'The :attribute is not correct',
            'cover_id.*.distinct'   => 'Dublicated cover id',
            'cover_id.array'        => 'Field must be an array containing at least one cover id in it',
            'meta_keywords.array'   => 'Keywords must be an array of strigns',
        ];
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'status'        => ["required", "in:" . implode(",", config('page.status'))],
//            'type'          => ['required', "type_exists"],
            'template_id'   => ['required', 'template_id_exists'],
            'language_id'   => ['required', 'exists:languages,id'],
            'title'         => ['required'],
            'meta'          => ['array'],
            'slug'          => ['required', 'slug_is_unique', 'regex:/^[a-zა-ჰа-я\d]+[a-zა-ჰа-я-_\d]+[a-zა-ჰа-я\d]$/iu'],
            'cover_id'      => $this->cover_id !== null?['array', 'exists:files,id']:'',
            'meta_keywords'     => ['array'],
        ];
    }
}
