<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'startDate' => $this->start_at,
            'position' => optional($this->roles->first())->name,
            'department' => $this->department,
            'status' => $this->status,
        ];
    }
}
