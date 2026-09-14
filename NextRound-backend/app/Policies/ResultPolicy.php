<?php

namespace App\Policies;

use App\Models\Result;
use App\Models\User;

class ResultPolicy
{
    public function view(User $user, Result $result): bool
    {
        return true;
    }

    public function update(User $user, Result $result): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($result->match->tournament->user_id !== $user->id) {
            return false;
        }

        return !$this->nextRoundExists($result);
    }

    public function delete(User $user, Result $result): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($result->match->tournament->user_id !== $user->id) {
            return false;
        }

        return !$this->nextRoundExists($result);
    }

    private function nextRoundExists(Result $result): bool
    {
        $match = $result->match;
        $tournament = $match->tournament;

        $nextRound = match ($match->round) {
            'round_of_32' => 'round_of_16',
            'round_of_16' => 'quarter_final',
            'quarter_final' => 'semi_final',
            'semi_final' => 'final',
            'final' => null,
            default => null,
        };

        if ($nextRound === null) {
            return false;
        }

        return $tournament->matches()
            ->where('round', $nextRound)
            ->exists();
    }
}
