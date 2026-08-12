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
            // Template
            'template' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:5120',
            ],

            // =========================
            // NAMA PESERTA
            // =========================
            'nama_x' => ['required', 'numeric', 'between:0,100'],
            'nama_y' => ['required', 'numeric', 'between:0,100'],
            'nama_font_size' => ['required', 'numeric', 'between:0.1,120'],
            'nama_font_family' => [
                'required',
                'in:Luxurious Script,Times New Roman,DejaVu Sans,Arial',
            ],
            'nama_alignment' => ['required', 'in:left,center,right'],
            'nama_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'nama_color' => [
                'required',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            // =========================
            // ASAL SEKOLAH
            // =========================
            'asal_x' => ['required', 'numeric', 'between:0,100'],
            'asal_y' => ['required', 'numeric', 'between:0,100'],
            'asal_font_size' => ['required', 'numeric', 'between:0.1,120'],
            'asal_font_family' => [
                'required',
                'in:Luxurious Script,Times New Roman,DejaVu Sans,Arial',
            ],
            'asal_alignment' => ['required', 'in:left,center,right'],
            'asal_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'asal_color' => [
                'required',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            // =========================
            // PERIODE PKL
            // =========================
            'periode_x' => ['required', 'numeric', 'between:0,100'],
            'periode_y' => ['required', 'numeric', 'between:0,100'],
            'periode_font_size' => ['required', 'numeric', 'between:0.1,120'],
            'periode_font_family' => [
                'required',
                'in:Luxurious Script,Times New Roman,DejaVu Sans,Arial',
            ],
            'periode_alignment' => ['required', 'in:left,center,right'],
            'periode_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'periode_color' => [
                'required',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            // =========================
            // TANGGAL TANDA TANGAN
            // =========================
            'tanggal_x' => ['required', 'numeric', 'between:0,100'],
            'tanggal_y' => ['required', 'numeric', 'between:0,100'],
            'tanggal_font_size' => ['required', 'numeric', 'between:0.1,120'],
            'tanggal_font_family' => [
                'required',
                'in:Luxurious Script,Times New Roman,DejaVu Sans,Arial',
            ],
            'tanggal_alignment' => ['required', 'in:left,center,right'],
            'tanggal_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'tanggal_color' => [
                'required',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'template.image' => 'File template harus berupa gambar.',
            'template.mimes' => 'Template harus berformat JPG, JPEG, atau PNG.',
            'template.max' => 'Ukuran template maksimal 5 MB.',

            'nama_color.regex' =>
                'Kode warna Nama Peserta harus format #RRGGBB.',

            'asal_color.regex' =>
                'Kode warna Asal Sekolah harus format #RRGGBB.',

            'periode_color.regex' =>
                'Kode warna Periode PKL harus format #RRGGBB.',

            'tanggal_color.regex' =>
                'Kode warna Tanggal Tanda Tangan harus format #RRGGBB.',

            'nama_font_family.in' =>
                'Font Nama Peserta tidak valid.',

            'asal_font_family.in' =>
                'Font Asal Sekolah tidak valid.',

            'periode_font_family.in' =>
                'Font Periode PKL tidak valid.',

            'tanggal_font_family.in' =>
                'Font Tanggal Tanda Tangan tidak valid.',
        ];
    }
}