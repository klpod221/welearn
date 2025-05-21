<?php

namespace App\Models;

class QuestionChoice extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'question_id',
        'choice_text',
        'is_correct',
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
            'is_correct' => 'boolean',
        ];
    }

    /**
     * Get the question that owns the choice.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
