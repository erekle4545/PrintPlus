<?php

namespace App\Widgets;
use App\Helpers\Core\Multitenant;
use Arrilot\Widgets\AbstractWidget;

class SidebarMenu extends AbstractWidget
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
        $model = Multitenant::getModel('Menu');
        $this->config = $model::where('parent_id','!=',null)->where('parent_id','!=',0)->with('info', function ($query) {
            $query->where('language_id', \App\Helpers\Core\Language::languageId());
        })->orderBy('order', 'asc')->withDepth()->get()->toTree();



        return view('widgets.sidebar_menu', [
            'config' => $this->config,
            'slug'=> 'klubebi'
        ]);
    }
}
