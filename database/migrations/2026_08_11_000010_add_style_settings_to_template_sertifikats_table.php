<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->string('nama_color')->default('#f6b833')->after('nama_font_size');
            $table->string('nama_font_family')->default('Luxurious Script')->after('nama_color');
            $table->string('periode_color')->default('#111176')->after('periode_font_size');
            $table->string('periode_font_family')->default('Times New Roman')->after('periode_color');
            $table->string('tanggal_color')->default('#111176')->after('tanggal_font_size');
            $table->string('tanggal_font_family')->default('Times New Roman')->after('tanggal_color');
        });
    }

    public function down(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->dropColumn([
                'nama_color',
                'nama_font_family',
                'periode_color',
                'periode_font_family',
                'tanggal_color',
                'tanggal_font_family',
            ]);
        });
    }
};
