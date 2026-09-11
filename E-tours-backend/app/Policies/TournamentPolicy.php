<?php

namespace App\Policies;

use App\Models\Tournament;
use App\Models\User;

class TournamentPolicy
{
    /**
     * Determine whether the user can view the tournament.
     */
    public function view(User $user, Tournament $tournament): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create tournaments.
     */
    public function create(User $user): bool
    {
        return $user->role === 'normal_user'
            || $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the tournament.
     */
    public function update(User $user, Tournament $tournament): bool
    {
        return $user->role === 'admin'
            || $tournament->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the tournament.
     */
    public function delete(User $user, Tournament $tournament): bool
    {
        return $user->role === 'admin'
            || $tournament->user_id === $user->id;
    }
}
