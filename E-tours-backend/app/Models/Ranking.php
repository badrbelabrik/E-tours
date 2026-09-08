<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ranking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'game_id',
        'points',
        'victories',
        'defeats',
        'position',
    ];

    // Ranking belongs to one player
    public function player()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Ranking belongs to one game
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
