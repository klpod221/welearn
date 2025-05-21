<?php

namespace App\Http\Controllers;

use App\Http\Requests\Setting\CreateRequest;
use App\Http\Requests\Setting\UpdateRequest;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * The setting model instance.
     *
     * @var \App\Models\Setting
     */
    protected $setting;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Setting $setting)
    {
        $this->setting = $setting;
    }

    /**
     * Get all settings
     * @group Settings
     */
    public function index()
    {
        $settings = $this->setting->all();

        return response()->json($settings);
    }

    /**
     * Display the specified setting by ID.
     * @group Settings
     */
    public function show(Setting $setting)
    {
        return response()->json($setting);
    }

    /**
     * Create a new setting
     * @group Settings
     */
    public function store(CreateRequest $request)
    {
        $setting = $this->setting->create($request->validated());

        return response()->json($setting, 201);
    }

    /**
     * Update a setting
     * @group Settings
     */
    public function update(UpdateRequest $request, Setting $setting)
    {
        $setting->update($request->validated());

        return response()->json($setting);
    }

    /**
     * Delete a setting
     * @group Settings
     */
    public function destroy(Setting $setting)
    {
        $setting->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }
}
