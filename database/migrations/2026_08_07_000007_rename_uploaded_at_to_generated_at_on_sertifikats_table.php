<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sertifikats', function (Blueprint $table) {
            $table->timestamp('generated_at')->nullable()->after('file_path');
        });

        \Illuminate\Support\Facades\DB::table('sertifikats')
            ->whereNull('generated_at')
            ->update(['generated_at' => \Illuminate\Support\Facades\DB::raw('uploaded_at')]);
    }

    public function down(): void
    {
        Schema::table('sertifikats', function (Blueprint $table) {
            $table->dropColumn('generated_at');
        });
    }
};