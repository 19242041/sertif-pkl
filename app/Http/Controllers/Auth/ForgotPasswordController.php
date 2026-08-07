<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetCodeMail;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'email' => $request->query('email'),
        ]);
    }

    public function verify(Request $request): Response
    {
        return Inertia::render('Auth/VerifyResetCode', [
            'status' => session('status'),
            'email' => $request->query('email'),
            'resendAvailableIn' => (int) session('resend_available_in', 0),
        ]);
    }

    public function reset(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'status' => session('status'),
            'email' => $request->query('email'),
            'token' => $request->query('token'),
        ]);
    }

    public function sendCode(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'Email belum terdaftar di SIMPATIK.',
            ]);
        }

        $emailKey = Str::lower($user->email);
        $rateKey = 'password-reset-code:'.$emailKey;
        $cooldownKey = 'password-reset-code-cooldown:'.$emailKey;

        if (RateLimiter::tooManyAttempts($rateKey, 3)) {
            $seconds = RateLimiter::availableIn($rateKey);

            throw ValidationException::withMessages([
                'email' => "Terlalu banyak permintaan kode. Coba lagi dalam {$seconds} detik.",
            ]);
        }

        if (Cache::has($cooldownKey)) {
            $seconds = max(1, Cache::get($cooldownKey) - now()->timestamp);

            throw ValidationException::withMessages([
                'email' => "Tunggu {$seconds} detik sebelum mengirim ulang kode.",
            ]);
        }

        $code = sprintf('%06d', random_int(0, 999999));

        PasswordResetCode::query()->where('email', $user->email)->delete();
        PasswordResetCode::query()->create([
            'email' => $user->email,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
        ]);

        Mail::to($user->email)->send(new PasswordResetCodeMail($code));

        RateLimiter::hit($rateKey, 15 * 60);
        Cache::put($cooldownKey, now()->addSeconds(30)->timestamp, now()->addSeconds(30));

        return redirect()->route('password.code.verify', ['email' => $user->email])
            ->with([
                'status' => 'Kode reset sudah dikirim ke email Anda.',
                'resend_available_in' => 30,
            ]);
    }

    public function verifyCode(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
        ]);

        $codeRecord = PasswordResetCode::query()
            ->where('email', $validated['email'])
            ->latest('created_at')
            ->first();

        if (! $codeRecord) {
            throw ValidationException::withMessages([
                'code' => 'Kode belum dikirim atau sudah dihapus. Kirim ulang kode terlebih dahulu.',
            ]);
        }

        if ($codeRecord->expires_at->isPast()) {
            $codeRecord->delete();

            throw ValidationException::withMessages([
                'code' => 'Kode sudah kedaluwarsa. Kirim ulang kode terlebih dahulu.',
            ]);
        }

        if ($codeRecord->code !== $validated['code']) {
            throw ValidationException::withMessages([
                'code' => 'Kode yang dimasukkan salah.',
            ]);
        }

        $token = Str::random(64);

        Cache::put(
            'password-reset-token:'.$token,
            [
                'email' => $validated['email'],
                'code' => $validated['code'],
            ],
            now()->addMinutes(10)
        );

        return redirect()->route('password.code.reset', [
            'token' => $token,
            'email' => $validated['email'],
        ]);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $payload = Cache::get('password-reset-token:'.$validated['token']);

        if (! $payload || $payload['email'] !== $validated['email']) {
            throw ValidationException::withMessages([
                'email' => 'Token reset tidak valid atau sudah kedaluwarsa.',
            ]);
        }

        $codeRecord = PasswordResetCode::query()
            ->where('email', $validated['email'])
            ->where('code', $payload['code'])
            ->first();

        if (! $codeRecord || $codeRecord->expires_at->isPast()) {
            Cache::forget('password-reset-token:'.$validated['token']);

            throw ValidationException::withMessages([
                'email' => 'Kode reset tidak valid atau sudah kedaluwarsa.',
            ]);
        }

        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'Email belum terdaftar di SIMPATIK.',
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(60),
        ])->save();

        PasswordResetCode::query()->where('email', $validated['email'])->delete();
        Cache::forget('password-reset-token:'.$validated['token']);

        return redirect()->route('login')->with('status', 'Password berhasil diperbarui. Silakan login kembali.');
    }
}