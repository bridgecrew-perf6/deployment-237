<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Schema;

class EventScope implements Scope
{
    protected $eventId;

    public function __construct(string $eventId)
    {
        $this->eventId = $eventId;
    }

    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  Builder  $builder
     * @param  Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        $table = $model->getTable();

        if(Schema::hasColumn($table, 'event_id')){
            $builder->where('event_id', $this->eventId);
        }
    }
}
