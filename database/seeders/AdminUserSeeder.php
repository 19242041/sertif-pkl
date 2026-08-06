<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'adminsertif@disnakertrans.local'],
            [
                'name' => 'Admin Sertif',
                'username' => 'adminsertif',
                'password' => Hash::make('adminsertif2201'),
            ]
        );
    }
}