<?php

namespace App\Models;

class Module extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'position',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'course_id' => 'integer',
            'position' => 'integer',
        ];
    }

    /**
     * Get the course that owns the module.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the lessons for the module.
     */
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    /**
     * Get the exams for the module.
     */
    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}
