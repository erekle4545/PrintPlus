<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register new user
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ], [
                'name.required' => 'სახელი აუცილებელია',
                'email.required' => 'ელ. ფოსტა აუცილებელია',
                'email.email' => 'ელ. ფოსტა არასწორია',
                'email.unique' => 'ეს ელ. ფოსტა უკვე დარეგისტრირებულია',
                'password.required' => 'პაროლი აუცილებელია',
                'password.min' => 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო',
                'password.confirmed' => 'პაროლები არ ემთხვევა',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
                'message' => 'რეგისტრაცია წარმატებით დასრულდა'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'რეგისტრაცია ვერ მოხერხდა'
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ], [
                'email.required' => 'ელ. ფოსტა აუცილებელია',
                'email.email' => 'ელ. ფოსტა არასწორია',
                'password.required' => 'პაროლი აუცილებელია',
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['მონაცემები არასწორია'],
                ]);
            }

            // Delete old tokens
            $user->tokens()->delete();

            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
                'message' => 'წარმატებით შეხვედით'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'შესვლა ვერ მოხერხდა'
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            // Delete current token
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'წარმატებით გახვედით'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'გასვლა ვერ მოხერხდა'
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        try {
            return response()->json([
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'email_verified_at' => $request->user()->email_verified_at,
                    'created_at' => $request->user()->created_at,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'მომხმარებლის მონაცემების წამოღება ვერ მოხერხდა'
            ], 500);
        }
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request)
    {
        try {
            $user = $request->user();

            // Delete old token
            $request->user()->currentAccessToken()->delete();

            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'message' => 'ტოკენი განახლდა'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'ტოკენის განახლება ვერ მოხერხდა'
            ], 500);
        }
    }
}
