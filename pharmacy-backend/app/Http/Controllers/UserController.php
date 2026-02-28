<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json($users);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,pharmacist,cashier,storekeeper',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => true,
        ]);

        // Log activity
        ActivityLog::log(
            'create',
            "Created user: {$user->name} ({$user->email})",
            'User',
            $user->id,
            $validated
        );

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'password' => 'sometimes|nullable|string|min:6',
            'role' => 'sometimes|required|in:admin,pharmacist,cashier,storekeeper',
            'is_active' => 'sometimes|boolean',
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:500',
        ]);

        // Update password only if provided
        if (isset($validated['password']) && !empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Log activity
        ActivityLog::log(
            'update',
            "Updated user: {$user->name}",
            'User',
            $user->id,
            $validated
        );

        return response()->json($user);
    }

    /**
     * Remove the specified user
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        $userName = $user->name;
        $user->delete();

        // Log activity
        ActivityLog::log(
            'delete',
            "Deleted user: {$userName}",
            'User',
            $id
        );

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent deactivating yourself
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot deactivate your own account'
            ], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $status = $user->is_active ? 'activated' : 'deactivated';

        // Log activity
        ActivityLog::log(
            'update',
            "User {$status}: {$user->name}",
            'User',
            $user->id,
            ['is_active' => $user->is_active]
        );

        return response()->json([
            'message' => "User {$status} successfully",
            'user' => $user
        ]);
    }

    /**
     * Get user statistics
     */
    public function statistics()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'inactive_users' => User::where('is_active', false)->count(),
            'by_role' => [
                'admin' => User::where('role', 'admin')->count(),
                'pharmacist' => User::where('role', 'pharmacist')->count(),
                'cashier' => User::where('role', 'cashier')->count(),
                'storekeeper' => User::where('role', 'storekeeper')->count(),
            ],
            'recent_users' => User::orderBy('created_at', 'desc')->take(5)->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Upload profile image
     */
    public function uploadProfileImage(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old image if exists
        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
        }

        // Store new image
        $path = $request->file('image')->store('profile-images', 'public');
        
        $user->profile_image = $path;
        $user->save();

        // Log activity
        ActivityLog::log(
            'update',
            "Updated profile image for user: {$user->name}",
            'User',
            $user->id
        );

        return response()->json([
            'message' => 'Profile image uploaded successfully',
            'profile_image' => $path,
            'url' => Storage::url($path)
        ]);
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 422);
        }

        // Update password
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        // Log activity
        ActivityLog::log(
            'update',
            "Changed password for user: {$user->name}",
            'User',
            $user->id
        );

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    /**
     * Update notification settings
     */
    public function updateNotificationSettings(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'low_stock_alerts' => 'boolean',
            'expiry_alerts' => 'boolean',
            'sales_reports' => 'boolean',
        ]);

        // Store notification settings in user preferences (you might want to create a separate table)
        // For now, we'll store it as JSON in a notification_settings column
        $user->notification_settings = json_encode($validated);
        $user->save();

        // Log activity
        ActivityLog::log(
            'update',
            "Updated notification settings for user: {$user->name}",
            'User',
            $user->id
        );

        return response()->json([
            'message' => 'Notification settings updated successfully',
            'settings' => $validated
        ]);
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        $userName = $user->name;
        $userId = $user->id;

        // Delete user's tokens
        $user->tokens()->delete();

        // Delete user
        $user->delete();

        // Log activity
        ActivityLog::log(
            'delete',
            "User deleted their own account: {$userName}",
            'User',
            $userId
        );

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}
