<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OptionalSanctumAuth
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->bearerToken()) {
            try {
                Auth::guard('sanctum')->authenticate();
            } catch (\Exception $e) {
                // token არავალიდურია — გააგრძელე როგორც guest
            }
        }

        return $next($request);
    }
}