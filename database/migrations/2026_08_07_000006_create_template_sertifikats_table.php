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
            $table->string('file_path');
            $table->float('nama_x')->default(50);
            $table->float('nama_y')->default(35);
            $table->unsignedInteger('nama_font_size')->default(28);
            $table->string('nama_alignment')->default('center');
            $table->float('periode_x')->default(50);
            $table->float('periode_y')->default(50);
            $table->unsignedInteger('periode_font_size')->default(18);
            $table->string('periode_alignment')->default('center');
            $table->float('tanggal_x')->default(50);
            $table->float('tanggal_y')->default(80);
            $table->unsignedInteger('tanggal_font_size')->default(18);
            $table->string('tanggal_alignment')->default('center');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_sertifikats');
    }
};