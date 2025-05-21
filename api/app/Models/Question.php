<?php

namespace App\Models;

class Question extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'exam_id',
        'question_text',
        'type',
        'score',
        'model_answer'
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'exam_id' => 'integer',
            'score' => 'integer',
            'type' => 'string',
        ];
    }

    /**
     * Get the exam that owns the question.
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Get the choices for the question.
     */
    public function choices()
    {
        return $this->hasMany(QuestionChoice::class);
    }

    /**
     * Get the test cases for the question.
     */
    public function testcases()
    {
        return $this->hasMany(QuestionTestcase::class);
    }
}
