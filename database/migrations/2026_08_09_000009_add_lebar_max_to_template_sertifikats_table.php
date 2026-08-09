<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->float('nama_lebar_max')->default(55)->after('nama_alignment');
            $table->float('periode_lebar_max')->default(75)->after('periode_alignment');
            $table->float('tanggal_lebar_max')->default(55)->after('tanggal_alignment');
        });
    }

    public function down(): void
    {
        Schema::table('template_sertifikats', function (Blueprint $table) {
            $table->dropColumn(['nama_lebar_max', 'periode_lebar_max', 'tanggal_lebar_max']);
        });
    }
};