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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Exam title
            $table->text('description')->nullable(); // Instructions or description
            $table->enum('type', ['lesson', 'module', 'course', 'standalone']); // Type of exam
            $table->foreignId('lesson_id')->nullable()->constrained()->onDelete('cascade'); // Exam for lesson (if applicable)
            $table->foreignId('module_id')->nullable()->constrained()->onDelete('cascade'); // Exam for module (if applicable)
            $table->foreignId('course_id')->nullable()->constrained()->onDelete('cascade'); // Exam for course (if applicable)
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // Creator of the exam
            $table->enum('status', ['draft', 'waiting', 'published'])->default('draft'); // Exam status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
