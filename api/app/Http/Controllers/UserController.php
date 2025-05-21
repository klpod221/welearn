<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\CreateRequest;
use App\Http\Requests\User\UpdateRequest;

class UserController extends Controller
{
    /**
     * The user model instance.
     *
     * @var \App\Models\User
     */
    protected $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get all users
     * @group User Management
     */
    public function index()
    {
        $users = $this->user->all();

        return response()->json($users);
    }

    /**
     * Display the specified user by ID.
     * @group User Management
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Create a new user
     * @group User Management
     */
    public function store(CreateRequest $request)
    {
        $user = $this->user->create($request->validated());

        return response()->json($user, 201);
    }

    /**
     * Update a user
     * @group User Management
     */
    public function update(UpdateRequest $request, User $user)
    {
        $user->update($request->validated());

        return response()->json($user);
    }

    /**
     * Update a user's role
     * @group User Management
     */
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|in:admin,user',
        ]);

        if ($user->id === 1 && $request->role !== 'admin') {
            return response()->json(['message' => 'Cannot change the role of the super admin user'], 403);
        }

        $user->update(['role' => $request->role]);

        return response()->json($user);
    }

    /**
     * Update a user's status
     * @group User Management
     */
    public function updateStatus(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);

        if ($user->id === 1 && $request->status === 'inactive') {
            return response()->json(['message' => 'Cannot set the super admin user to inactive'], 403);
        }

        $user->update(['status' => $request->status]);

        return response()->json($user);
    }

    /**
     * Update a user's password
     * @group User Management
     */
    public function updatePassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user->update(['password' => bcrypt($request->password)]);

        return response()->json($user);
    }

    /**
     * Delete a user
     * @group User Management
     */
    public function destroy(User $user)
    {
        if ($user->id === 1) {
            return response()->json(['message' => 'Cannot delete the super admin user'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
