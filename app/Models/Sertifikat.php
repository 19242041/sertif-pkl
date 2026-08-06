<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sertifikat extends Model
{
    use HasFactory;

    protected $table = 'sertifikats';

    protected $fillable = [
        'peserta_pkl_id',
        'nomor_sertifikat',
        'tanggal_sertifikat',
        'file_path',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_sertifikat' => 'date',
            'uploaded_at' => 'datetime',
        ];
    }

    public function pesertaPkl(): BelongsTo
    {
        return $this->belongsTo(PesertaPkl::class, 'peserta_pkl_id');
    }
}