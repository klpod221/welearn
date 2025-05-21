<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Language::truncate();

        Language::insert([
            [
                "name" => "Node.js",
                "code" => "nodejs",
                "extension" => ".js",
                "version" => "20"
            ],
            [
                "name" => "Python",
                "code" => "python",
                "extension" => ".py",
                "version" => "3"
            ],
            [
                "name" => "Java",
                "code" => "java",
                "extension" => ".java",
                "version" => "17"
            ],
            [
                "name" => "C++",
                "code" => "cpp",
                "extension" => ".cpp",
                "version" => "11"
            ],
            [
                "name" => "C",
                "code" => "c",
                "extension" => ".c",
                "version" => "11"
            ]
        ]);
    }
}
