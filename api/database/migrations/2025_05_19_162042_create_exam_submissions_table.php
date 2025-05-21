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
        Schema::create('exam_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade'); // Which exam was submitted
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who submitted
            $table->integer('score')->nullable(); // Final score
            $table->text('feedback')->nullable(); // General comments from reviewer
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null'); // Who reviewed
            $table->timestamp('reviewed_at')->nullable(); // When reviewed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_submissions');
    }
};
