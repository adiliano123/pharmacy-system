<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function googleAuth(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        try {
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($request->token);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'     => $googleUser->getName(),
                'password' => Hash::make(Str::random(32)),
                'role'     => 'cashier', // default role for social logins
                'is_active' => true,
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        ActivityLog::create([
            'user_id'    => $user->id,
            'action'     => 'login',
            'description' => "User {$user->name} logged in via Google",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,pharmacist,cashier,storekeeper',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Log activity
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'register',
            'description' => "User {$user->name} registered as {$user->role}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Log activity
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'description' => "User {$user->name} logged in",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent to your email.']);
        }

        return response()->json(['message' => 'Unable to send reset link. Please check the email address.'], 422);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
                $user->tokens()->delete(); // invalidate all existing tokens
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password has been reset successfully.']);
        }

        return response()->json(['message' => 'Invalid or expired reset token.'], 422);
    }
}
