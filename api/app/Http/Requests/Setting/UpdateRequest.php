<?php

namespace App\Http\Requests\Setting;

use Illuminate\Foundation\Http\FormRequest;

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
            'key' => 'sometimes|required|string|max:255|unique:settings,key,' . $this->route('id'),
            'value' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|in:string,boolean,integer,float',
            'autoload' => 'sometimes|required|boolean',
        ];
    }
}
