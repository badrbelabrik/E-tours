<?php

namespace App\Services;

use App\Models\Game;
use App\Models\Ranking;
use App\Models\User;

class RankingService
{
    /**
     * Update the ranking after a match result.
     */
    public function updateAfterMatch(
        User $winner,
        User $loser,
        Game $game
    ): void {
        $winnerRanking = $this->getOrCreateRanking($winner, $game);
        $loserRanking = $this->getOrCreateRanking($loser, $game);

        $winnerRanking->increment('victories');
        $winnerRanking->increment('points', 3);

        $loserRanking->increment('defeats');

        $this->recalculatePositions($game);
    }

    /**
     * Get or create a ranking for a user and game.
     */
    private function getOrCreateRanking(
        User $user,
        Game $game
    ): Ranking {
        return Ranking::firstOrCreate(
            [
                'user_id' => $user->id,
                'game_id' => $game->id,
            ],
            [
                'points' => 0,
                'victories' => 0,
                'defeats' => 0,
                'position' => null,
            ]
        );
    }

    /**
     * Recalculate ranking positions for a game.
     */
    private function recalculatePositions(Game $game): void
    {
        $rankings = Ranking::where('game_id', $game->id)
            ->orderByDesc('points')
            ->orderByDesc('victories')
            ->get();

        foreach ($rankings as $index => $ranking) {
            $ranking->update([
                'position' => $index + 1,
            ]);
        }
    }
}
