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

        // Nomor Sertifikat
        'nomor_x',
        'nomor_y',
        'nomor_font_size',
        'nomor_font_family',
        'nomor_alignment',
        'nomor_lebar_max',
        'nomor_color',

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

        // Nama Penandatangan / Kepala UPTD
        'ttd_nama_x',
        'ttd_nama_y',
        'ttd_nama_font_size',
        'ttd_nama_font_family',
        'ttd_nama_alignment',
        'ttd_nama_lebar_max',
        'ttd_nama_color',

        // NIP
        'nip_x',
        'nip_y',
        'nip_font_size',
        'nip_font_family',
        'nip_alignment',
        'nip_lebar_max',
        'nip_color',

        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'nomor_x' => 'float',
            'nomor_y' => 'float',
            'nomor_font_size' => 'float',
            'nomor_lebar_max' => 'float',

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

            'ttd_nama_x' => 'float',
            'ttd_nama_y' => 'float',
            'ttd_nama_font_size' => 'float',
            'ttd_nama_lebar_max' => 'float',

            'nip_x' => 'float',
            'nip_y' => 'float',
            'nip_font_size' => 'float',
            'nip_lebar_max' => 'float',

            'is_active' => 'boolean',
        ];
    }
}
