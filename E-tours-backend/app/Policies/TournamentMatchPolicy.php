<?php

namespace App\Policies;

use App\Models\TournamentMatch;
use App\Models\User;

class TournamentMatchPolicy
{
    public function view(User $user, TournamentMatch $match): bool
    {
        return true;
    }

    public function update(User $user, TournamentMatch $match): bool
    {
        return $user->role === 'admin'
            || $match->tournament->user_id === $user->id;
    }

    public function delete(User $user, TournamentMatch $match): bool
    {
        return $user->role === 'admin'
            || $match->tournament->user_id === $user->id;
    }
}
