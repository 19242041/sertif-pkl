<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PesertaPkl extends Model
{
    use HasFactory;

    protected $table = 'peserta_pkls';

    protected $fillable = [
        'nama',
        'nis_nim',
        'asal_institusi',
        'jurusan',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'no_hp',
        'email',
        'pembimbing_sekolah',
        'pembimbing_lapangan',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'keterangan',
        'foto_url',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }

    public function sertifikats(): HasMany
    {
        return $this->hasMany(Sertifikat::class, 'peserta_pkl_id');
    }

    public function sertifikatTerbaru(): HasOne
    {
        return $this->hasOne(Sertifikat::class, 'peserta_pkl_id')->latestOfMany('generated_at');
    }
}