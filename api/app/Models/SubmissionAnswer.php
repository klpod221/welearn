<?php

namespace App\Models;

class SubmissionAnswer extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'submission_id',
        'question_id',
        'type',
        'answer_text',
        'selected_choices',
        'score_awarded',
        'feedback',
        'reviewed_by',
        'reviewed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'submission_id' => 'integer',
            'question_id' => 'integer',
            'score_awarded' => 'integer',
            'reviewed_by' => 'integer',
        ];
    }

    /**
     * Get the submission that owns the answer.
     */
    public function submission()
    {
        return $this->belongsTo(ExamSubmission::class, 'submission_id');
    }

    /**
     * Get the question that owns the answer.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Get the choices that are selected for the answer.
     */
    public function codeFiles()
    {
        return $this->hasMany(CodeFile::class);
    }

    /**
     * Get the user that reviewed the answer.
     */
    public function reviewBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
