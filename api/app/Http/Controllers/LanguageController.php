<?php

namespace App\Http\Controllers;

use App\Http\Requests\Language\CreateRequest;
use App\Http\Requests\Language\UpdateRequest;
use App\Models\Language;

class LanguageController extends Controller
{
    protected $language;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Language $language)
    {
        $this->language = $language;
    }

    /**
     * Get all languages
     * @group Programming Languages
     */
    public function index()
    {
        $languages = $this->language->all();

        return response()->json($languages);
    }

    /**
     * Get a language by id
     * @group Programming Languages
     */
    public function show($id)
    {
        $language = $this->language->find($id);

        if (!$language) {
            return response()->json(['message' => 'Language not found'], 404);
        }

        return response()->json($language);
    }

    /**
     * Create a new language
     * @group Programming Languages
     */
    public function store(CreateRequest $request)
    {
        $language = $this->language->create($request->validated());

        return response()->json($language, 201);
    }

    /**
     * Update a language
     * @group Programming Languages
     */
    public function update(UpdateRequest $request, $id)
    {
        $language = $this->language->find($id);

        if (!$language) {
            return response()->json(['message' => 'Language not found'], 404);
        }

        $language->update($request->validated());

        return response()->json($language);
    }

    /**
     * Delete a language
     * @group Programming Languages
     */
    public function destroy($id)
    {
        $language = $this->language->find($id);

        if (!$language) {
            return response()->json(['message' => 'Language not found'], 404);
        }

        $language->delete();

        return response()->json(['message' => 'Language deleted successfully']);
    }
}
