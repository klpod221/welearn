<?php

namespace App\Http\Requests\RunCode;

use Illuminate\Foundation\Http\FormRequest;

class RunCodeRequest extends FormRequest
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
            'language' => 'required|string',
            'input' => 'string|nullable', // base64 encoded string
            'files' => 'required|array',
            'files.*.name' => 'required|string',
            'files.*.content' => 'required|string', // base64 encoded string
            'files.*.isMain' => 'required|boolean',
        ];
    }
}
