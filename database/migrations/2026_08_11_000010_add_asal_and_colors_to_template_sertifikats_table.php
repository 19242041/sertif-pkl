<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            // Posisi, ukuran, & lebar area untuk field baru: Asal Sekolah
            // (mengikuti pola persis nama_x/nama_y/nama_font_size/nama_alignment/nama_lebar_max)
            $table->float('asal_x')->default(50)->after('nama_lebar_max');
            $table->float('asal_y')->default(45)->after('asal_x');
            $table->integer('asal_font_size')->default(16)->after('asal_y');
            $table->string('asal_alignment')->default('center')->after('asal_font_size');
            $table->float('asal_lebar_max')->default(65)->after('asal_alignment');

            // Warna teks kustom (hex) untuk tiap field
            $table->string('nama_color', 7)->default('#f6b833')->after('asal_lebar_max');
            $table->string('asal_color', 7)->default('#111176')->after('nama_color');
            $table->string('periode_color', 7)->default('#111176')->after('asal_color');
            $table->string('tanggal_color', 7)->default('#111176')->after('periode_color');
        });
    }

    public function down(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->dropColumn([
                'asal_x',
                'asal_y',
                'asal_font_size',
                'asal_alignment',
                'asal_lebar_max',
                'nama_color',
                'asal_color',
                'periode_color',
                'tanggal_color',
            ]);
        });
    }
};