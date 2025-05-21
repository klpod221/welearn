<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::truncate();

        Setting::insert([
            [
                'key' => 'allow_registration',
                'value' => 'true',
                'type' => 'boolean',
                'autoload' => 'false',
            ],
            [
                'key' => 'new_user_must_verify',
                'value' => 'true',
                'type' => 'boolean',
                'autoload' => 'false',
            ]
        ]);
    }
}
