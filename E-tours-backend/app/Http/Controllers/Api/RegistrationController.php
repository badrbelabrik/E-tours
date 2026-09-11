<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Models\Tournament;
use App\Services\RegistrationService;
use Illuminate\Http\Request;
use InvalidArgumentException;

class RegistrationController extends Controller
{
    public function __construct(
        protected RegistrationService $registrationService
    ) {
    }

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
        try {
            $registration = $this->registrationService->register(
                $request->user(),
                $tournament
            );

            return response()->json([
                'message' => 'Registration submitted successfully.',
                'registration' => $registration
            ], 201);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Approve or reject a registration.
     */
    public function update(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        try {
            $registration = $this->registrationService->updateStatus(
                $registration,
                $validated['status']
            );

            return response()->json([
                'message' => 'Registration status updated successfully.',
                'registration' => $registration
            ]);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Cancel the authenticated user's registration.
     */
    public function destroy(Request $request, Tournament $tournament)
    {
        try {
            $registration = $this->registrationService->cancel(
                $request->user(),
                $tournament
            );

            return response()->json([
                'message' => 'Registration cancelled successfully.',
                'registration' => $registration
            ]);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 404);
        }
    }
}
