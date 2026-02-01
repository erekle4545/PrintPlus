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
    public function handleProviderCallback($provider)
    {
        try {
            // Get user info from provider
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Check if user exists by email
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'password' => bcrypt(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
            } else {
                // Update existing user with provider info
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                ]);
            }

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect to frontend with token
            $frontendUrl = config('app.frontend_url', 'https://printplus.ge');
            return redirect($frontendUrl . '/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            // Redirect to frontend with error
            $frontendUrl = config('app.frontend_url', 'https://printplus.ge');
            return redirect($frontendUrl . '/login?error=authentication_failed');
        }
    }
}
