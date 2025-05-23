<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get courses created by the user.
     */
    public function courses()
    {
        return $this->hasMany(Course::class, 'created_by');
    }

    /**
     * Get the lessons created by the user.
     */
    public function exams()
    {
        return $this->hasMany(Exam::class, 'created_by');
    }

    /**
     * Get the submissions created by the user.
     */
    public function submissions()
    {
        return $this->hasMany(ExamSubmission::class);
    }

    /**
     * Get the submissions reviewed by the user.
     */
    public function reviewed()
    {
        return $this->hasMany(ExamSubmission::class, 'reviewed_by');
    }
}
