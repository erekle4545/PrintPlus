<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Redirect to OAuth provider
     */
    public function redirectToProvider($provider)
    {
        $validated = in_array($provider, ['facebook', 'google']);

        if (!$validated) {
            return response()->json([
                'error' => 'Invalid provider'
            ], 400);
        }

        try {
            $url = Socialite::driver($provider)
                ->stateless()
                ->redirect()
                ->getTargetUrl();

            return response()->json([
                'url' => $url
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate authentication URL'
            ], 500);
        }
    }

    /**
     * Handle OAuth provider callback
     */
    public function handleProviderCallback(Request $request, $provider)
    {
        try {
            // Get user info from provider
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Check if user exists by email
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                // Create new user - Laravel ავტომატურად მიანიჭებს სწორ ID-ს
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'password' => bcrypt(Str::random(16)),
                    'email_verified_at' => now(),
                ]);

//                \Log::error('New  cuserreated via ' . $provider . ': ID=' . $user->id . ', Email=' . $user->email);
            } else {
                // Update existing user with provider info if not set
                if (!$user->provider || !$user->provider_id) {
                    $user->update([
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                    ]);
                }

//                \Log::error('Existing user logged in via ' . $provider . ': ID=' . $user->id . ', Email=' . $user->email);
            }

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Get language
            $lang = $request->cookie('language') ?? 'ka';

            // Redirect to frontend with token
            $frontendUrl = config('app.frontend_url', 'https://printplus.ge');
            return redirect($frontendUrl . '/' . $lang . '/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            \Log::error('Social auth callback error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            $lang = $request->cookie('language') ?? 'ka';
            $frontendUrl = config('app.frontend_url', 'https://printplus.ge');
            return redirect($frontendUrl . '/' . $lang . '/login?error=authentication_failed');
        }
    }

}
