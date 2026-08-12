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
        'nama_x',
        'nama_y',
        'nama_font_size',
        'nama_color',
        'nama_font_family',
        'nama_alignment',
        'nama_lebar_max',
        'nama_color',
        'asal_x',
        'asal_y',
        'asal_font_size',
        'asal_alignment',
        'asal_lebar_max',
        'asal_color',
        'periode_x',
        'periode_y',
        'periode_font_size',
        'periode_color',
        'periode_font_family',
        'periode_alignment',
        'periode_lebar_max',
        'periode_color',
        'tanggal_x',
        'tanggal_y',
        'tanggal_font_size',
        'tanggal_color',
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
            'nama_font_size' => 'integer',
            'nama_color' => 'string',
            'nama_font_family' => 'string',
            'nama_lebar_max' => 'float',
            'asal_x' => 'float',
            'asal_y' => 'float',
            'asal_font_size' => 'integer',
            'asal_lebar_max' => 'float',
            'periode_x' => 'float',
            'periode_y' => 'float',
            'periode_font_size' => 'integer',
            'periode_color' => 'string',
            'periode_font_family' => 'string',
            'periode_lebar_max' => 'float',
            'tanggal_x' => 'float',
            'tanggal_y' => 'float',
            'tanggal_font_size' => 'integer',
            'tanggal_color' => 'string',
            'tanggal_font_family' => 'string',
            'tanggal_lebar_max' => 'float',
            'is_active' => 'boolean',
        ];
    }
}