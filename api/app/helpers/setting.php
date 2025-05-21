<?php

use App\Models\Setting;

if (!function_exists('setting')) {
    function setting(string $key, mixed $default = null): mixed
    {
        static $settingsCache = [];

        if (array_key_exists($key, $settingsCache)) {
            return $settingsCache[$key];
        }

        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return $settingsCache[$key] = $default;
        }

        // Cast thủ công nếu type là JSON
        $value = match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $setting->value,
            'json'    => json_decode($setting->value, true),
            default   => $setting->value,
        };

        return $settingsCache[$key] = $value;
    }
}
