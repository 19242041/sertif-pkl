<?php

namespace App\Http\Requests\Sertifikat;

use Illuminate\Foundation\Http\FormRequest;

class StoreSertifikatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'peserta_pkl_id' => ['required', 'exists:peserta_pkls,id'],
            'nomor_sertifikat' => ['required', 'string', 'max:255'],
            'tanggal_sertifikat' => ['required', 'date'],
            'file' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ];
    }
}