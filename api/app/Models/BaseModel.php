<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

abstract class BaseModel extends Model
{
    use HasFactory;

    /**
     * The "booted" method of the model.
     * 
     * This method is called when the model is booted and adds a global scope
     * to automatically order all query results by the 'id' column in ascending order.
     * 
     * @return void
     */
    protected static function booted()
    {
        static::addGlobalScope('orderById', function ($query) {
            $query->orderBy('id', 'asc');
        });
    }
}
