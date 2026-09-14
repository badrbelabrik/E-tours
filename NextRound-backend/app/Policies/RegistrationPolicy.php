<?php

namespace App\Policies;

use App\Models\Registration;
use App\Models\User;

class RegistrationPolicy
{
    public function view(User $user, Registration $registration): bool
    {
        return $user->role === 'admin'
            || $registration->tournament->user_id === $user->id;
    }

    public function update(User $user, Registration $registration): bool
    {
        return $user->role === 'admin'
            || $registration->tournament->user_id === $user->id;
    }

    public function delete(User $user, Registration $registration): bool
    {
        return $user->role === 'admin'
            || $registration->user_id === $user->id;
    }
}
