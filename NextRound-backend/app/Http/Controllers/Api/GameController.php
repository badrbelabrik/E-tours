<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Display a listing of games.
     */
    public function index()
    {
        $games = Game::latest()->get();

        return response()->json([
            'games' => $games
        ]);
    }

    /**
     * Store a newly created game.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:games,name',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
        ]);

        $game = Game::create($validated);

        return response()->json([
            'message' => 'Game created successfully.',
            'game' => $game
        ], 201);
    }

    /**
     * Display the specified game.
     */
    public function show(Game $game)
    {
        return response()->json([
            'game' => $game
        ]);
    }

    /**
     * Update the specified game.
     */
    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:games,name,' . $game->id,
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
        ]);

        $game->update($validated);

        return response()->json([
            'message' => 'Game updated successfully.',
            'game' => $game
        ]);
    }

    /**
     * Remove the specified game.
     */
    public function destroy(Game $game)
    {
        $game->delete();

        return response()->json([
            'message' => 'Game deleted successfully.'
        ]);
    }
}
