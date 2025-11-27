<?php

namespace App\Http\Requests;

use App\Models\Core\Menu;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Factory;

class UpdateMenuRequest extends FormRequest
{
    public function __construct(Factory $factory)
    {
        $factory->extend(
            'slug_on_level_unique',
            function ($attribute, $value, $parameters) {
                /**
                 * Find any menu with parent id and slug on current level
                 */
                return Menu::with('info')->where(['parent_id' => $this->parent_id?:null])->whereHas('info', function ($query) {
                        $query->where(['slug' => $this->slug, 'language_id' => $this->language_id]);
                        if ($this->id) {
                            $query->where('menu_id', '!=', $this->id);
                        }
                    })->get()->count() === 0;
            },
            'Provided slug already exists, choose different one'
        );
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
     * @return array
     */
    public function messages()
    {
        $menuTypes = collect(config('menu.positions'))->map(function ($item) {
            return $item['id'];
        });

        return [
            'active.required'               => sprintf('Status field is required, available values are [%s]', implode(',', config('menu.status'))),
            'active.in'                     => sprintf('Incorrect value %s, available values are [%s]', $this->active, implode(',', config('menu.status'))),
            'page_id.required'              => 'Page is required',
            'page_id.exists'                => sprintf('Page with id %s does not exist', $this->page_id),
            'type.required'                 => sprintf('Type field is required, available values are [%s]', implode(",", $menuTypes->toArray())),
            'type.in'                       => sprintf('Incorrect value %s, available values are [%s]', $this->type, implode(",", $menuTypes->toArray())),
            'parent_id.exists'              => sprintf('Can not find parent with id %s', $this->parent_id),
            'language_id.required'          => 'Language ID is required',
            'language_id.exists'            => sprintf('Provided language id %s is incorrect', $this->language_id),
            'title.required'                => 'Title field is required',
            'slug.required'                 => 'Slug is required',
            'slug.regex'                    => 'Slug contains disallowed characters',
        ];
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $menuTypes = collect(config('menu.positions'))->map(function ($item) {
            return $item['id'];
        });

        if($this->has_custom_link == true) {

            return [
                'active'            => ["required", "in:" . implode(",", config('menu.status'))],
                'type'              => ["required", "in:" . implode(",", $menuTypes->toArray())],
                'parent_id'         => ["exists:menus,id"],
                'language_id'       => ['required', 'exists:languages,id'],
                'title'             => ['required'],
                'slug'              => ['required'],
            ];
        }

        return [
            'active'            => ["required", "in:" . implode(",", config('menu.status'))],
            'page_id'           => ["required", 'exists:pages,id'],
            'type'              => ["required", "in:" . implode(",", $menuTypes->toArray())],
            'parent_id'         => ["exists:menus,id"],
            'language_id'       => ['required', 'exists:languages,id'],
            'title'             => ['required'],
            'slug'              => ['required', 'slug_on_level_unique', 'regex:/^[a-zა-ჰа-я\d]+[a-zა-ჰа-я-_\d]+[a-zა-ჰа-я\d]$/iu'],
            'meta'              => ['array'],
        ];
    }
}
