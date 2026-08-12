<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_sertifikats', function (Blueprint $table) {
            $table->id();

            // File template
            $table->string('file_path');

            // =========================
            // NAMA PESERTA
            // =========================
            $table->float('nama_x')->default(50);
            $table->float('nama_y')->default(35);
            $table->float('nama_font_size')->default(80);
            $table->string('nama_font_family')->default('Luxurious Script');
            $table->string('nama_alignment')->default('center');
            $table->float('nama_lebar_max')->default(70);
            $table->string('nama_color')->default('#f6b833');

            // =========================
            // ASAL SEKOLAH
            // =========================
            $table->float('asal_x')->default(50);
            $table->float('asal_y')->default(45);
            $table->float('asal_font_size')->default(16);
            $table->string('asal_font_family')->default('Times New Roman');
            $table->string('asal_alignment')->default('center');
            $table->float('asal_lebar_max')->default(65);
            $table->string('asal_color')->default('#111176');

            // =========================
            // PERIODE PKL
            // =========================
            $table->float('periode_x')->default(50);
            $table->float('periode_y')->default(52);
            $table->float('periode_font_size')->default(19);
            $table->string('periode_font_family')->default('Times New Roman');
            $table->string('periode_alignment')->default('center');
            $table->float('periode_lebar_max')->default(65);
            $table->string('periode_color')->default('#111176');

            // =========================
            // TANGGAL TANDA TANGAN
            // =========================
            $table->float('tanggal_x')->default(50);
            $table->float('tanggal_y')->default(78);
            $table->float('tanggal_font_size')->default(13);
            $table->string('tanggal_font_family')->default('Times New Roman');
            $table->string('tanggal_alignment')->default('center');
            $table->float('tanggal_lebar_max')->default(55);
            $table->string('tanggal_color')->default('#111176');

            // Status template
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_sertifikats');
    }
};