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
        'nama_alignment',
        'nama_lebar_max',
        'periode_x',
        'periode_y',
        'periode_font_size',
        'periode_alignment',
        'periode_lebar_max',
        'tanggal_x',
        'tanggal_y',
        'tanggal_font_size',
        'tanggal_alignment',
        'tanggal_lebar_max',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'nama_x' => 'float',
            'nama_y' => 'float',
            'nama_font_size' => 'integer',
            'nama_lebar_max' => 'float',
            'periode_x' => 'float',
            'periode_y' => 'float',
            'periode_font_size' => 'integer',
            'periode_lebar_max' => 'float',
            'tanggal_x' => 'float',
            'tanggal_y' => 'float',
            'tanggal_font_size' => 'integer',
            'tanggal_lebar_max' => 'float',
            'is_active' => 'boolean',
        ];
    }
}