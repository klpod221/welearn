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
        Schema::create('languages', function (Blueprint $table) { // Programming languages
            $table->id();
            $table->string('name'); // Language name
            $table->string('code')->unique(); // Language code (e.g., 'python', 'javascript')
            $table->string('extension'); // Supported file extensions (e.g., '.py, .js')
            $table->string('version')->nullable(); // Language version (e.g., '3.8.5', '14.15.0')
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
