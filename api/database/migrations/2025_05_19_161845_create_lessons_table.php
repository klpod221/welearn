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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->onDelete('cascade'); // Belongs to module
            $table->string('title'); // Lesson title
            $table->text('description')->nullable(); // Lesson description
            $table->text('content')->nullable(); // Lesson content (HTML/Markdown)
            $table->integer('position')->default(0); // Display order in module
            $table->integer('duration')->default(0); // Duration in minutes
            $table->enum('status', ['draft', 'published'])->default('draft'); // Lesson status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
