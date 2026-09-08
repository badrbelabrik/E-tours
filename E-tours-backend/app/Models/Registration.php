<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'tournament_id',
        'user_id',
        'registration_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'registration_date' => 'date',
        ];
    }

    // Registration belongs to one player
    public function player()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Registration belongs to one tournament
    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }
}
