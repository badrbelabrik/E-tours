<?php

namespace App\Services;

use App\Models\Result;
use App\Models\TournamentMatch;
use Illuminate\Support\Facades\DB;

class ResultService
{
    public function __construct(
        protected RankingService $rankingService,
        protected MatchService $matchService
    ) {
    }

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

            $match->update([
                'status' => 'finished',
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

            $this->generateNextRoundIfReady($match);

            return $result;
        });
    }

    public function updateResult(
        Result $result,
        int $scorePlayer1,
        int $scorePlayer2,
        int $winnerId
    ): Result {
        return DB::transaction(function () use (
            $result,
            $scorePlayer1,
            $scorePlayer2,
            $winnerId
        ) {
            $result->update([
                'score_player1' => $scorePlayer1,
                'score_player2' => $scorePlayer2,
                'winner_id' => $winnerId,
            ]);

            $game = $result->match->tournament->game;

            $this->rankingService->recalculateForGame($game);

            return $result->fresh();
        });
    }

    public function deleteResult(Result $result): void
    {
        DB::transaction(function () use ($result) {
            $game = $result->match->tournament->game;

            $match = $result->match;

            $result->delete();

            $match->update([
                'status' => 'scheduled',
            ]);

            $this->rankingService->recalculateForGame($game);
        });
    }

    private function generateNextRoundIfReady(
        TournamentMatch $match
    ): void {
        $tournament = $match->tournament;

        $currentRound = $match->round;

        $currentMatches = $tournament->matches()
            ->where('round', $currentRound)
            ->with('result')
            ->get();

        if ($currentMatches->isEmpty()) {
            return;
        }

        $allFinished = $currentMatches->every(
            fn ($currentMatch) =>
                $currentMatch->status === 'finished' &&
                $currentMatch->result !== null
        );

        if (!$allFinished) {
            return;
        }

        $this->matchService->generateNextRound($tournament);
    }
}
