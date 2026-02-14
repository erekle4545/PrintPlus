<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait GuestSessionTrait
{
    protected function getGuestSessionId(Request $request): string
    {
        $cookieSessionId = $request->cookie('cart_session_id');

        if ($cookieSessionId) {
            $request->session()->put('cart_session', $cookieSessionId);
            return $cookieSessionId;
        }

        if (!$request->session()->has('cart_session')) {
            $request->session()->put('cart_session', $request->session()->getId());
        }

        $sessionId = $request->session()->get('cart_session');

        cookie()->queue('cart_session_id', $sessionId, 60 * 24 * 30);

        return $sessionId;
    }
}