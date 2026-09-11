<?php


namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification for a user.
     */
    public function create(
        User   $user,
        string $title,
        string $message
    ): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'is_read' => false,
        ]);
    }
}
