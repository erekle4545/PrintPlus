<?php

namespace App\Widgets;

use App\Helpers\Core\Language;
use App\Helpers\Core\Multitenant;
use Arrilot\Widgets\AbstractWidget;

class Menu extends AbstractWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];

    /**
     * Treat this method as a controller action.
     * Return view() or other content to display.
     */
    public function run()
    {
        $menuModel = Multitenant::getModel('Menu');

        $type = $this->config['data'] = $menuModel::where('active',1)->type(isset($this->config['type']) ? $this->config['type'] : config('menu.positions.header'))->with(['info' => function ($query) {
            $query->where('language_id', Language::languageId());
        }])->orderBy('order', 'asc')->withDepth()->get()->toTree();

        return view(isset($this->config['view']) ? 'widgets.menu.'.$this->config['view']  : 'widgets.menu', [
            'config' => $this->config,
        ]);

    }
}
