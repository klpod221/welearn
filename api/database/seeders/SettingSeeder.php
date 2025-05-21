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

        Setting::create([
            'key' => 'allow_registration',
            'value' => 'true',
            'type' => 'boolean',
            'autoload' => 'false',
        ]);
    }
}
