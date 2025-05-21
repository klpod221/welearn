<?php

namespace App\Models;

class Language extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'extension',
        'version',
    ];
}
