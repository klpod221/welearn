<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    protected $user;

    /**
     * Create a new controller instance.
     *
     * @group Auth
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Register API
     *
     * @group Authentication
     * @unauthenticated
     */
    public function register(RegisterRequest $request)
    {
        // Check if this is the first user
        $isFirstUser = $this->user->count() === 0;

        if (!$isFirstUser && !setting('allow_registration', false)) {
            return response()->json(['message' => 'Registration is disabled'], 403);
        }

        // create user
        $user = $this->user->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $isFirstUser ? 'admin' : 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Login API
     *
     * @group Authentication
     * @unauthenticated
     */
    public function login(LoginRequest $request)
    {
        $user = $this->user->where('email', $request->email)->first();

        if (!$user || !password_verify($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * User Profile API
     *
     * @group Authentication
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Logout API
     *
     * @group Authentication
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
