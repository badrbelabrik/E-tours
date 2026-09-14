<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Result extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'score_player1',
        'score_player2',
        'winner_id',
    ];

    // Result belongs to one match
    public function match()
    {
        return $this->belongsTo(TournamentMatch::class, 'match_id');
    }

    // Result belongs to one winner
    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_id');
    }
}
