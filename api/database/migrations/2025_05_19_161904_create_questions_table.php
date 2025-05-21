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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade'); // Part of which exam
            $table->text('question_text'); // The question content
            $table->enum('type', ['single_choice', 'multiple_choice', 'essay', 'code']); // Question type
            $table->integer('score')->default(1); // Max score
            $table->text('model_answer')->nullable(); // Reference answer for essay/code
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
