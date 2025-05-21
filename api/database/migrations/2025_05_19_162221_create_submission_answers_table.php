<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submission_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('exam_submissions')->onDelete('cascade'); // Which submission
            $table->foreignId('question_id')->constrained()->onDelete('cascade'); // Answered question
            $table->enum('type', ['single_choice', 'multiple_choice', 'essay', 'code']); // Type of question
            $table->text('answer_text')->nullable(); // Essay/code answer
            $table->json('selected_choices')->nullable(); // Selected choice IDs (array)
            $table->integer('score_awarded')->nullable(); // Score given for this answer
            $table->integer('feedback')->nullable(); // Feedback for the answer
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null'); // Who reviewed
            $table->timestamp('reviewed_at')->nullable(); // When reviewed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_answers');
    }
};
