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
        Schema::create('code_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_answer_id')->constrained('submission_answers')->onDelete('cascade'); // Which submission answer
            $table->string('filename'); // Name of the file
            $table->longText('content'); // Content of the file (base64 encoded)
            $table->foreignId('language_id')->constrained('languages')->onDelete('cascade'); // Language of the code
            $table->boolean('is_main')->default(false); // Is this the main file?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('code_files');
    }
};
