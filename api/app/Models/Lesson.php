<?php

namespace App\Models;

class Lesson extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'module_id',
        'title',
        'description',
        'content',
        'position',
        'duration',
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
            'module_id' => 'integer',
            'position' => 'integer',
            'duration' => 'integer',
            'status' => 'string',
        ];
    }

    /**
     * Get the module that owns the lesson.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the exams for the lesson.
     */
    public function exams()
    {
        return $this->hasMany(Exam::class);
    }
}
