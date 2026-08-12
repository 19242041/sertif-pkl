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
            'template' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:5120',
            ],

            // NAMA
            'nama_x' => ['required', 'numeric', 'between:0,100'],
            'nama_y' => ['required', 'numeric', 'between:0,100'],
            'nama_font_size' => ['required', 'numeric'],
            'nama_color' => ['required', 'string', 'regex:/^#[A-Fa-f0-9]{6}$/'],
            'nama_font_family' => ['required', 'string'],
            'nama_alignment' => ['required', 'in:left,center,right'],
            'nama_lebar_max' => ['required', 'numeric', 'between:1,100'],
<<<<<<< HEAD
            'nama_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'asal_x' => ['required', 'numeric', 'between:0,100'],
            'asal_y' => ['required', 'numeric', 'between:0,100'],
            'asal_alignment' => ['required', 'in:left,center,right'],
            'asal_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'asal_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
=======

            // PERIODE
>>>>>>> 3bb9cb7891f17e44bd23793f456857729951a19e
            'periode_x' => ['required', 'numeric', 'between:0,100'],
            'periode_y' => ['required', 'numeric', 'between:0,100'],
            'periode_font_size' => ['required', 'numeric'],
            'periode_color' => ['required', 'string', 'regex:/^#[A-Fa-f0-9]{6}$/'],
            'periode_font_family' => ['required', 'string'],
            'periode_alignment' => ['required', 'in:left,center,right'],
            'periode_lebar_max' => ['required', 'numeric', 'between:1,100'],
<<<<<<< HEAD
            'periode_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
=======

            // TANGGAL TANDA TANGAN
>>>>>>> 3bb9cb7891f17e44bd23793f456857729951a19e
            'tanggal_x' => ['required', 'numeric', 'between:0,100'],
            'tanggal_y' => ['required', 'numeric', 'between:0,100'],
            'tanggal_font_size' => ['required', 'numeric'],
            'tanggal_color' => ['required', 'string', 'regex:/^#[A-Fa-f0-9]{6}$/'],
            'tanggal_font_family' => ['required', 'string'],
            'tanggal_alignment' => ['required', 'in:left,center,right'],
            'tanggal_lebar_max' => ['required', 'numeric', 'between:1,100'],
            'tanggal_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_color.regex' => 'Kode warna Nama Peserta harus format #RRGGBB.',
            'asal_color.regex' => 'Kode warna Asal Sekolah harus format #RRGGBB.',
            'periode_color.regex' => 'Kode warna Periode PKL harus format #RRGGBB.',
            'tanggal_color.regex' => 'Kode warna Tanggal Tanda Tangan harus format #RRGGBB.',
        ];
    }
}