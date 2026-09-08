<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image',
    ];

    // A game can have many tournaments
    public function tournaments()
    {
        return $this->hasMany(Tournament::class);
    }

    // A game can have many player rankings
    public function rankings()
    {
        return $this->hasMany(Ranking::class);
    }
}
