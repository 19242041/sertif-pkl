<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateSertifikat extends Model
{
    use HasFactory;

    protected $table = 'template_sertifikats';

    protected $fillable = [
        'file_path',

        // Nama Peserta
        'nama_x',
        'nama_y',
        'nama_font_size',
        'nama_font_family',
        'nama_alignment',
        'nama_lebar_max',
        'nama_color',

        // Asal Sekolah
        'asal_x',
        'asal_y',
        'asal_font_size',
        'asal_font_family',
        'asal_alignment',
        'asal_lebar_max',
        'asal_color',

        // Periode PKL
        'periode_x',
        'periode_y',
        'periode_font_size',
        'periode_font_family',
        'periode_alignment',
        'periode_lebar_max',
        'periode_color',

        // Tanggal Tanda Tangan
        'tanggal_x',
        'tanggal_y',
        'tanggal_font_size',
        'tanggal_font_family',
        'tanggal_alignment',
        'tanggal_lebar_max',
        'tanggal_color',

        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'nama_x' => 'float',
            'nama_y' => 'float',
            'nama_font_size' => 'float',
            'nama_lebar_max' => 'float',

            'asal_x' => 'float',
            'asal_y' => 'float',
            'asal_font_size' => 'float',
            'asal_lebar_max' => 'float',

            'periode_x' => 'float',
            'periode_y' => 'float',
            'periode_font_size' => 'float',
            'periode_lebar_max' => 'float',

            'tanggal_x' => 'float',
            'tanggal_y' => 'float',
            'tanggal_font_size' => 'float',
            'tanggal_lebar_max' => 'float',

            'is_active' => 'boolean',
        ];
    }
}