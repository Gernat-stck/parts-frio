<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeCreateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'nullable|string|min:6',
            'phone'        => 'nullable|string',
            'department'   => 'nullable|string',
            'municipality' => 'nullable|string',
            'address'      => 'nullable|string',
            'status'       => 'nullable|string|in:active,inactive',
            'start_at'     => 'nullable|date',
            'position'      => 'required|string',
            'roles'        => 'nullable|array',
            'roles.*'      => 'exists:roles,slug'
        ];
    }
}
