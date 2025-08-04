<?php

namespace App\Http\Requests\Employee;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class EmployeeUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Obtén el userId directamente del parámetro de la ruta
        $userIdFromRoute = $this->route('userId'); // <-- Cambio aquí

        // Intenta encontrar el usuario real si necesitas validaciones más complejas,
        // o simplemente compara los IDs si es suficiente.
        // Para este caso, solo necesitamos el ID para comparar y para la regla unique.

        // Si necesitas el modelo para hasAnyRole, tendrías que cargarlo:
        $userBeingUpdated = User::where('user_id', $userIdFromRoute)->first();


        // Autorización: Un usuario puede actualizar su propio perfil, o un administrador/super-admin puede actualizar cualquier perfil.
        return Auth::check() && (
            Auth::user()->hasAnyRole(['admin', 'super-admin']) ||
            ($userBeingUpdated && Auth::user()->user_id === $userBeingUpdated->user_id)
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtén el ID del usuario directamente del parámetro de la ruta.
        // Asumiendo que tu ruta tiene un segmento como {userId}
        $userIdToIgnore = $this->route('userId'); // <-- Cambio aquí

        return [
            'name'         => 'required|string|max:255',
            'email'        => [
                'required',
                'email',
                // Ignora el email si pertenece al usuario con el $userIdToIgnore.
                Rule::unique('users', 'email')->ignore($userIdToIgnore, 'user_id'),
            ],
            'password'     => 'nullable|string|min:6',
            'phone'        => 'nullable|string',
            'department'   => 'nullable|string',
            'municipality' => 'nullable|string',
            'address'      => 'nullable|string',
            'status'       => 'nullable|string|in:active,inactive',
            'start_at'     => 'nullable|date',
            'position'     => 'required|string',
            'roles'        => 'nullable|array',
            'roles.*'      => 'exists:roles,slug'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'El correo electrónico ya está en uso por otro empleado.',
            // Puedes añadir más mensajes personalizados aquí
        ];
    }
}