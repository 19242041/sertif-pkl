<?php

namespace App\Http\Requests\Sertifikat;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateSertifikatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'nama_x' => ['required', 'numeric', 'between:0,100'],
            'nama_y' => ['required', 'numeric', 'between:0,100'],
            'nama_alignment' => ['required', 'in:left,center,right'],
            'nama_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'periode_x' => ['required', 'numeric', 'between:0,100'],
            'periode_y' => ['required', 'numeric', 'between:0,100'],
            'periode_alignment' => ['required', 'in:left,center,right'],
            'periode_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'tanggal_x' => ['required', 'numeric', 'between:0,100'],
            'tanggal_y' => ['required', 'numeric', 'between:0,100'],
            'tanggal_alignment' => ['required', 'in:left,center,right'],
            'tanggal_lebar_max' => ['required', 'numeric', 'between:1,100'],
        ];
    }
}