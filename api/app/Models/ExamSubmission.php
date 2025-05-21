<?php

namespace App\Models;

class ExamSubmission extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'exam_id',
        'user_id',
        'score',
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
            'exam_id' => 'integer',
            'user_id' => 'integer',
            'score' => 'integer',
            'reviewed_by' => 'integer',
        ];
    }

    /**
     * Get the exam that owns the submission.
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Get the user that owns the submission.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user that reviewed the submission.
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the answers for the submission.
     */
    public function answers()
    {
        return $this->hasMany(SubmissionAnswer::class, 'submission_id');
    }
}
