<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TournamentMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'tournament_id',
        'round',
        'first_player_id',
        'second_player_id',
        'scheduled_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    // Match belongs to one tournament
    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    // First player
    public function firstPlayer()
    {
        return $this->belongsTo(User::class, 'first_player_id');
    }

    // Second player
    public function secondPlayer()
    {
        return $this->belongsTo(User::class, 'second_player_id');
    }

    // Match can have one result
    public function result()
    {
        return $this->hasOne(Result::class);
    }
}
