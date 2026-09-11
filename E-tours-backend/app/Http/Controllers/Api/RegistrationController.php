<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Models\Tournament;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    /**
     * Display registrations for a tournament.
     */
    public function index(Tournament $tournament)
    {
        $registrations = $tournament->registrations()
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'registrations' => $registrations
        ]);
    }

    /**
     * Register the authenticated user for a tournament.
     */
    public function store(Request $request, Tournament $tournament)
    {
        $user = $request->user();

        // Check if the tournament is open
        if ($tournament->status !== 'open') {
            return response()->json([
                'message' => 'This tournament is not open for registration.'
            ], 422);
        }

        // Check if the tournament is full
        $approvedCount = $tournament->registrations()
            ->where('status', 'approved')
            ->count();

        if ($approvedCount >= $tournament->max_players) {
            return response()->json([
                'message' => 'This tournament is full.'
            ], 422);
        }

        // Check existing registration
        $registration = Registration::where('tournament_id', $tournament->id)
            ->where('user_id', $user->id)
            ->first();

        if ($registration && $registration->status !== 'cancelled') {
            return response()->json([
                'message' => 'You are already registered for this tournament.'
            ], 409);
        }

        if ($registration) {
            $registration->update([
                'status' => 'pending',
                'registration_date' => now()->toDateString(),
            ]);
        } else {
            $registration = Registration::create([
                'tournament_id' => $tournament->id,
                'user_id' => $user->id,
                'status' => 'pending',
                'registration_date' => now()->toDateString(),
            ]);
        }

        return response()->json([
            'message' => 'Registration submitted successfully.',
            'registration' => $registration
        ], 201);
    }

    /**
     * Approve or reject a registration.
     */
    public function update(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $registration->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Registration status updated successfully.',
            'registration' => $registration
        ]);
    }

    /**
     * Cancel the authenticated user's registration.
     */
    public function destroy(Request $request, Tournament $tournament)
    {
        $registration = Registration::where('tournament_id', $tournament->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$registration) {
            return response()->json([
                'message' => 'Registration not found.'
            ], 404);
        }

        $registration->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Registration cancelled successfully.'
        ]);
    }
}
