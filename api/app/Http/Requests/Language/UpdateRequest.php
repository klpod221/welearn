<?php

namespace App\Http\Requests\Language;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:10',
                Rule::unique('languages')->ignore($this->route('language')),
            ],
            'extension' => 'sometimes|required|string|max:10',
            'version' => 'sometimes|required|string|max:10',
        ];
    }
}
