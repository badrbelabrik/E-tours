<?php

namespace App\Services;

use App\Models\Game;
use App\Models\Ranking;
use App\Models\Result;
use App\Models\TournamentMatch;
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
     * Rebuild the rankings for a game from all existing results.
     *
     * This is useful when a result is updated or deleted.
     */
    public function recalculateForGame(Game $game): void
    {
        $matches = TournamentMatch::whereHas(
            'tournament',
            fn ($query) => $query->where('game_id', $game->id)
        )
            ->with(['result', 'firstPlayer', 'secondPlayer'])
            ->get();

        $statistics = [];

        foreach ($matches as $match) {
            if (!$match->result) {
                continue;
            }

            $result = $match->result;

            $firstPlayerId = $match->first_player_id;
            $secondPlayerId = $match->second_player_id;

            foreach ([$firstPlayerId, $secondPlayerId] as $playerId) {
                if ($playerId === null) {
                    continue;
                }

                if (!isset($statistics[$playerId])) {
                    $statistics[$playerId] = [
                        'points' => 0,
                        'victories' => 0,
                        'defeats' => 0,
                    ];
                }
            }

            if (isset($statistics[$result->winner_id])) {
                $statistics[$result->winner_id]['victories']++;
                $statistics[$result->winner_id]['points'] += 3;
            }

            $loserId = $result->winner_id === $firstPlayerId
                ? $secondPlayerId
                : $firstPlayerId;

            if ($loserId !== null && isset($statistics[$loserId])) {
                $statistics[$loserId]['defeats']++;
            }
        }

        foreach ($statistics as $userId => $stats) {
            Ranking::updateOrCreate(
                [
                    'user_id' => $userId,
                    'game_id' => $game->id,
                ],
                [
                    'points' => $stats['points'],
                    'victories' => $stats['victories'],
                    'defeats' => $stats['defeats'],
                ]
            );
        }

        // Reset rankings for players who no longer have results.
        Ranking::where('game_id', $game->id)
            ->get()
            ->each(function (Ranking $ranking) use ($statistics) {
                if (!isset($statistics[$ranking->user_id])) {
                    $ranking->update([
                        'points' => 0,
                        'victories' => 0,
                        'defeats' => 0,
                    ]);
                }
            });

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
