<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            // =========================
            // NOMOR SERTIFIKAT
            // =========================
            $table->decimal('nomor_x', 8, 2)->default(50)->after('tanggal_color');
            $table->decimal('nomor_y', 8, 2)->default(20)->after('nomor_x');
            $table->decimal('nomor_font_size', 8, 2)->default(14)->after('nomor_y');
            $table->string('nomor_font_family')->default('Times New Roman')->after('nomor_font_size');
            $table->string('nomor_alignment')->default('center')->after('nomor_font_family');
            $table->decimal('nomor_lebar_max', 8, 2)->default(65)->after('nomor_alignment');
            $table->string('nomor_color', 7)->default('#111176')->after('nomor_lebar_max');
        });
    }

    public function down(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->dropColumn([
                'nomor_x',
                'nomor_y',
                'nomor_font_size',
                'nomor_font_family',
                'nomor_alignment',
                'nomor_lebar_max',
                'nomor_color',
            ]);
        });
    }
};
