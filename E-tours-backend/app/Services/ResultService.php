<?php

namespace App\Services;

use App\Models\Result;
use App\Models\TournamentMatch;
use Illuminate\Support\Facades\DB;

class ResultService
{
    public function __construct(
        protected RankingService $rankingService
    ) {
    }

    /**
     * Record a match result and update the ranking.
     */
    public function createResult(
        TournamentMatch $match,
        int $scorePlayer1,
        int $scorePlayer2,
        int $winnerId
    ): Result {
        return DB::transaction(function () use (
            $match,
            $scorePlayer1,
            $scorePlayer2,
            $winnerId
        ) {
            $result = Result::create([
                'match_id' => $match->id,
                'score_player1' => $scorePlayer1,
                'score_player2' => $scorePlayer2,
                'winner_id' => $winnerId,
            ]);

            $winner = $match->first_player_id === $winnerId
                ? $match->firstPlayer
                : $match->secondPlayer;

            $loser = $match->first_player_id === $winnerId
                ? $match->secondPlayer
                : $match->firstPlayer;

            $game = $match->tournament->game;

            $this->rankingService->updateAfterMatch(
                $winner,
                $loser,
                $game
            );

            return $result;
        });
    }
}
