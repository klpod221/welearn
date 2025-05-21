<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeFile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'submission_answer_id',
        'filename',
        'content',
        'language_id',
        'is_main',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'submission_answer_id' => 'integer',
            'language_id' => 'integer',
            'is_main' => 'boolean',
        ];
    }

    /**
     * Get the submission answer that owns the code file.
     */
    public function submissionAnswer()
    {
        return $this->belongsTo(SubmissionAnswer::class);
    }
}
