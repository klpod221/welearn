<?php

namespace App\Http\Controllers;

use App\Http\Requests\Setting\CreateRequest;
use App\Http\Requests\Setting\UpdateRequest;
use App\Models\Setting;

class SettingController extends Controller
{
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
     * Display the specified setting by ID or key.
     * @group Settings
     */
    public function show($id)
    {
        // Check if the route parameter is numeric (ID) or string (key)
        if (is_numeric($id)) {
            $setting = $this->setting->find($id);
        } else {
            $setting = $this->setting->where('key', $id)->first();
        }

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

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
    public function update(UpdateRequest $request, $id)
    {
        $setting = $this->setting->find($id);

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->update($request->validated());

        return response()->json($setting);
    }

    /**
     * Delete a setting
     * @group Settings
     */
    public function destroy($id)
    {
        $setting = $this->setting->find($id);

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }
}
