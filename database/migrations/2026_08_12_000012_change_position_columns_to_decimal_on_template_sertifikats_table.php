<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            // decimal(8,2) = bisa nampung nilai negatif s/d ribuan, dengan 2 angka
            // di belakang koma. Tidak ada batas minimum/maksimum yang dipaksakan
            // di level database — validasi batas cukup di aplikasi (kalau memang
            // masih ada), bukan di kolom.
            $table->decimal('nama_x', 8, 2)->default(50)->change();
            $table->decimal('nama_y', 8, 2)->default(35)->change();
            $table->decimal('nama_font_size', 8, 2)->default(80)->change();
            $table->decimal('nama_lebar_max', 8, 2)->default(55)->change();

            $table->decimal('asal_x', 8, 2)->default(50)->change();
            $table->decimal('asal_y', 8, 2)->default(45)->change();
            $table->decimal('asal_font_size', 8, 2)->default(16)->change();
            $table->decimal('asal_lebar_max', 8, 2)->default(65)->change();

            $table->decimal('periode_x', 8, 2)->default(50)->change();
            $table->decimal('periode_y', 8, 2)->default(55)->change();
            $table->decimal('periode_font_size', 8, 2)->default(19)->change();
            $table->decimal('periode_lebar_max', 8, 2)->default(65)->change();

            $table->decimal('tanggal_x', 8, 2)->default(50)->change();
            $table->decimal('tanggal_y', 8, 2)->default(78)->change();
            $table->decimal('tanggal_font_size', 8, 2)->default(13)->change();
            $table->decimal('tanggal_lebar_max', 8, 2)->default(55)->change();
        });
    }

    public function down(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->integer('nama_x')->default(50)->change();
            $table->integer('nama_y')->default(35)->change();
            $table->integer('nama_font_size')->default(80)->change();
            $table->integer('nama_lebar_max')->default(55)->change();

            $table->integer('asal_x')->default(50)->change();
            $table->integer('asal_y')->default(45)->change();
            $table->integer('asal_font_size')->default(16)->change();
            $table->integer('asal_lebar_max')->default(65)->change();

            $table->integer('periode_x')->default(50)->change();
            $table->integer('periode_y')->default(55)->change();
            $table->integer('periode_font_size')->default(19)->change();
            $table->integer('periode_lebar_max')->default(65)->change();

            $table->integer('tanggal_x')->default(50)->change();
            $table->integer('tanggal_y')->default(78)->change();
            $table->integer('tanggal_font_size')->default(13)->change();
            $table->integer('tanggal_lebar_max')->default(55)->change();
        });
    }
};
