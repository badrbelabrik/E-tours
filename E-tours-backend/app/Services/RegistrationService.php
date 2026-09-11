<?php

namespace App\Services;

use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class RegistrationService
{
    public function __construct(
        protected NotificationService $notificationService
    ) {
    }

    /**
     * Register a user for a tournament.
     */
    public function register(
        User $user,
        Tournament $tournament
    ): Registration {
        return DB::transaction(function () use ($user, $tournament) {

            if ($tournament->status !== 'open') {
                throw new InvalidArgumentException(
                    'This tournament is not open for registration.'
                );
            }

            $approvedCount = $tournament->registrations()
                ->where('status', 'approved')
                ->count();

            if ($approvedCount >= $tournament->max_players) {
                throw new InvalidArgumentException(
                    'This tournament is full.'
                );
            }

            $registration = Registration::where('tournament_id', $tournament->id)
                ->where('user_id', $user->id)
                ->first();

            if ($registration && $registration->status !== 'cancelled') {
                throw new InvalidArgumentException(
                    'You are already registered for this tournament.'
                );
            }

            if ($registration) {
                $registration->update([
                    'status' => 'pending',
                    'registration_date' => now()->toDateString(),
                ]);
            } else {
                $registration = Registration::create([
                    'tournament_id' => $tournament->id,
                    'user_id' => $user->id,
                    'status' => 'pending',
                    'registration_date' => now()->toDateString(),
                ]);
            }

            return $registration;
        });
    }

    /**
     * Update a registration status.
     */
    public function updateStatus(
        Registration $registration,
        string $status
    ): Registration {
        return DB::transaction(function () use ($registration, $status) {

            $registration->update([
                'status' => $status,
            ]);

            $title = $status === 'approved'
                ? 'Registration approved'
                : 'Registration rejected';

            $message = $status === 'approved'
                ? "Your registration for {$registration->tournament->title} has been approved."
                : "Your registration for {$registration->tournament->title} has been rejected.";

            $this->notificationService->create(
                $registration->user,
                $title,
                $message
            );

            return $registration;
        });
    }

    /**
     * Cancel a user's registration.
     */
    public function cancel(
        User $user,
        Tournament $tournament
    ): Registration {
        return DB::transaction(function () use ($user, $tournament) {

            $registration = Registration::where('tournament_id', $tournament->id)
                ->where('user_id', $user->id)
                ->first();

            if (!$registration) {
                throw new InvalidArgumentException(
                    'Registration not found.'
                );
            }

            $registration->update([
                'status' => 'cancelled',
            ]);

            return $registration;
        });
    }
}
