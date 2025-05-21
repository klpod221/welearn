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
        Schema::create('question_testcases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->onDelete('cascade'); // For code question
            $table->text('input'); // Input value
            $table->text('expected_output'); // Expected result
            $table->boolean('is_hidden')->default(true); // Show to student or hidden?
            $table->integer('score')->default(0); // Score for this test case
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_testcases');
    }
};
