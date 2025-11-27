<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatementsController extends Controller
{

    public function addStatements()
    {
        return view('web.pages.statement.addStatement');

    }
}
