<?php

namespace App\Models;

class QuestionTestcase extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'question_id',
        'input',
        'expected_output',
        'is_hidden',
        'score',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'question_id' => 'integer',
            'is_hidden' => 'boolean',
            'score' => 'integer',
        ];
    }

    /**
     * Get the question that owns the test case.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
