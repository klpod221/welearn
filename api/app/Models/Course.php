<?php

namespace App\Models;

class Course extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'created_by',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_by' => 'integer',
            'status' => 'string',
        ];
    }

    /**
     * Get the user that created the course.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the lessons for the course.
     */
    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    /**
     * Get the lessons for the course.
     */
    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}
