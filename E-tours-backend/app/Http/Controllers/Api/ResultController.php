<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\TournamentMatch;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    /**
     * Display a listing of results.
     */
    public function index()
    {
        $results = Result::with([
            'match',
            'winner'
        ])->latest()->get();

        return response()->json([
            'results' => $results
        ]);
    }

    /**
     * Store a newly created result.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'match_id' => 'required|exists:matches,id|unique:results,match_id',
            'score_player1' => 'required|integer|min:0',
            'score_player2' => 'required|integer|min:0',
            'winner_id' => 'required|exists:users,id',
        ]);

        $match = TournamentMatch::findOrFail($validated['match_id']);

        // Make sure the winner is one of the players in the match
        if (
            $validated['winner_id'] != $match->first_player_id &&
            $validated['winner_id'] != $match->second_player_id
        ) {
            return response()->json([
                'message' => 'The winner must be one of the players in the match.'
            ], 422);
        }

        // A match cannot have a result if it is not finished
        if ($match->status !== 'finished') {
            return response()->json([
                'message' => 'The match must be finished before recording the result.'
            ], 422);
        }

        $result = Result::create([
            'match_id' => $validated['match_id'],
            'score_player1' => $validated['score_player1'],
            'score_player2' => $validated['score_player2'],
            'winner_id' => $validated['winner_id'],
        ]);

        return response()->json([
            'message' => 'Result created successfully.',
            'result' => $result
        ], 201);
    }

    /**
     * Display the specified result.
     */
    public function show(Result $result)
    {
        $result->load([
            'match',
            'winner'
        ]);

        return response()->json([
            'result' => $result
        ]);
    }

    /**
     * Update the specified result.
     */
    public function update(Request $request, Result $result)
    {
        $validated = $request->validate([
            'score_player1' => 'required|integer|min:0',
            'score_player2' => 'required|integer|min:0',
            'winner_id' => 'required|exists:users,id',
        ]);

        $match = $result->match;

        // Make sure the winner is one of the players
        if (
            $validated['winner_id'] != $match->first_player_id &&
            $validated['winner_id'] != $match->second_player_id
        ) {
            return response()->json([
                'message' => 'The winner must be one of the players in the match.'
            ], 422);
        }

        $result->update($validated);

        return response()->json([
            'message' => 'Result updated successfully.',
            'result' => $result
        ]);
    }

    /**
     * Remove the specified result.
     */
    public function destroy(Result $result)
    {
        $result->delete();

        return response()->json([
            'message' => 'Result deleted successfully.'
        ]);
    }
}
