<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // A user can organize many tournaments
    public function tournaments()
    {
        return $this->hasMany(Tournament::class);
    }

    // A user can have many registrations
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    // A user can receive many notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // A user can have many rankings, one per game
    public function rankings()
    {
        return $this->hasMany(Ranking::class);
    }

    // Matches where the user is player 1
    public function firstPlayerMatches()
    {
        return $this->hasMany(TournamentMatch::class, 'first_player_id');
    }

    // Matches where the user is player 2
    public function secondPlayerMatches()
    {
        return $this->hasMany(TournamentMatch::class, 'second_player_id');
    }

    // Results where the user is the winner
    public function wonResults()
    {
        return $this->hasMany(Result::class, 'winner_id');
    }
}
