<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->string('nama_font_family')
                ->default('Luxurious Script')
                ->after('nama_color');

            $table->string('asal_font_family')
                ->default('Times New Roman')
                ->after('asal_color');

            $table->string('periode_font_family')
                ->default('Times New Roman')
                ->after('periode_color');

            $table->string('tanggal_font_family')
                ->default('Times New Roman')
                ->after('tanggal_color');
        });
    }

    public function down(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->dropColumn([
                'nama_font_family',
                'asal_font_family',
                'periode_font_family',
                'tanggal_font_family',
            ]);
        });
    }
};