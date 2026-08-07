<?php

namespace App\Http\Requests\Sertifikat;

use Illuminate\Foundation\Http\FormRequest;

class StoreGeneratedSertifikatRequest extends FormRequest
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
            'tanggal_mulai_pkl' => ['nullable', 'date'],
            'tanggal_selesai_pkl' => ['nullable', 'date', 'after_or_equal:tanggal_mulai_pkl'],
            'tanggal_tanda_tangan' => ['required', 'date'],
        ];
    }
}