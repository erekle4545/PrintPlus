<?php

namespace App\Http\Controllers\API\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
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
                'phone' => 'required|string',
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
                'phone' => $validated['phone'],
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
                    'phone' => $request->user()->phone,
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


    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        // ვალიდაცია
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => ['required', 'string', 'max:20', 'regex:/^[0-9+\-\s()]*$/'],
            'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
        ], [
            'name.required' => 'სახელი და გვარი აუცილებელია',
            'name.max' => 'სახელი არ უნდა აღემატებოდეს 255 სიმბოლოს',
            'phone.required' => 'მობილური ნომერი აუცილებელია',
            'phone.regex' => 'მობილური ნომრის ფორმატი არასწორია',
            'email.required' => 'ელ-ფოსტა აუცილებელია',
            'email.email' => 'ელ-ფოსტის ფორმატი არასწორია',
            'email.unique' => 'ეს ელ-ფოსტა უკვე გამოყენებულია',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'ვალიდაციის შეცდომა',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth()->user();

            // შევამოწმოთ არის თუ არა ცვლილება
            $hasChanges = false;
            if ($user->name !== $request->name ||
                $user->phone !== $request->phone ||
                $user->email !== $request->email) {
                $hasChanges = true;
            }

            if (!$hasChanges) {
                return response()->json([
                    'success' => true,
                    'message' => 'ცვლილებები არ არის',
                    'user' => $user
                ], 200);
            }

            // მონაცემების განახლება
            $user->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
            ]);

            // განახლებული მომხმარებლის ჩატვირთვა
            $user->refresh();

            return response()->json([
                'success' => true,
                'message' => 'პროფილი წარმატებით განახლდა',
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'პროფილის განახლება ვერ მოხერხდა'
            ], 500);
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        // ვალიდაცია
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
            'new_password_confirmation' => 'required|string|min:8',
        ], [
            'current_password.required' => 'ძველი პაროლი აუცილებელია',
            'new_password.required' => 'ახალი პაროლი აუცილებელია',
            'new_password.min' => 'პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს',
            'new_password.confirmed' => 'პაროლები არ ემთხვევა',
            'new_password_confirmation.required' => 'გაიმეორეთ ახალი პაროლი',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'ვალიდაციის შეცდომა',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth()->user();

            // შევამოწმოთ ძველი პაროლი
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'ძველი პაროლი არასწორია'
                ], 400);
            }

            // შევამოწმოთ რომ ახალი პაროლი განსხვავდება ძველისგან
            if (Hash::check($request->new_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'ახალი პაროლი არ უნდა ემთხვეოდეს ძველ პაროლს'
                ], 400);
            }

            // პაროლის განახლება
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'პაროლი წარმატებით შეიცვალა',
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Change password error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'პაროლის შეცვლა ვერ მოხერხდა'
            ], 500);
        }
    }
}
