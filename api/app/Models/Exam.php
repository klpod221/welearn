<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'type',
        'lesson_id',
        'module_id',
        'course_id',
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
            'lesson_id' => 'integer',
            'module_id' => 'integer',
            'course_id' => 'integer',
            'created_by' => 'integer',
            'status' => 'string',
        ];
    }

    /**
     * Get the user that created the exam.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the course that owns the exam.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the module that owns the exam.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the lesson that owns the exam.
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Get the questions for the exam.
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Get the submissions for the exam.
     */
    public function submissions()
    {
        return $this->hasMany(ExamSubmission::class);
    }
}
