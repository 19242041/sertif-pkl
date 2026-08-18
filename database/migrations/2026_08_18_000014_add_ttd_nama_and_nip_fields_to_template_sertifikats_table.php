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
            // NAMA PENANDATANGAN / KEPALA UPTD
            // =========================
            $table->decimal('ttd_nama_x', 8, 2)->default(50)->after('nomor_color');
            $table->decimal('ttd_nama_y', 8, 2)->default(85)->after('ttd_nama_x');
            $table->decimal('ttd_nama_font_size', 8, 2)->default(14)->after('ttd_nama_y');
            $table->string('ttd_nama_font_family')->default('Times New Roman')->after('ttd_nama_font_size');
            $table->string('ttd_nama_alignment')->default('center')->after('ttd_nama_font_family');
            $table->decimal('ttd_nama_lebar_max', 8, 2)->default(55)->after('ttd_nama_alignment');
            $table->string('ttd_nama_color', 7)->default('#111176')->after('ttd_nama_lebar_max');

            // =========================
            // NIP
            // =========================
            $table->decimal('nip_x', 8, 2)->default(50)->after('ttd_nama_color');
            $table->decimal('nip_y', 8, 2)->default(90)->after('nip_x');
            $table->decimal('nip_font_size', 8, 2)->default(14)->after('nip_y');
            $table->string('nip_font_family')->default('Times New Roman')->after('nip_font_size');
            $table->string('nip_alignment')->default('center')->after('nip_font_family');
            $table->decimal('nip_lebar_max', 8, 2)->default(55)->after('nip_alignment');
            $table->string('nip_color', 7)->default('#111176')->after('nip_lebar_max');
        });
    }

    public function down(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->dropColumn([
                'ttd_nama_x',
                'ttd_nama_y',
                'ttd_nama_font_size',
                'ttd_nama_font_family',
                'ttd_nama_alignment',
                'ttd_nama_lebar_max',
                'ttd_nama_color',
                'nip_x',
                'nip_y',
                'nip_font_size',
                'nip_font_family',
                'nip_alignment',
                'nip_lebar_max',
                'nip_color',
            ]);
        });
    }
};
