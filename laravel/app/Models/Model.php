<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model as LaravelModel;

class Model extends LaravelModel
{
    protected $guarded = [
        'id', 'created_at', 'updated_at',
    ];

    protected function serializeDate(\DateTimeInterface $date): string {
        return $date->format('Y-m-d H:i:s');
    }

    public function scopeApplyWindowConditions($query, $window, $field = 'created_at') {
        $timezone = '';

        if ( $window == 'today' ) {
            $date = date('Y-m-d');
            $query->whereRaw('DATE('.\Date::getTimezoneOffsetForSql($timezone, $field).') = "'.$date.'"');
        }
        else if ( $window == 'yesterday' ) {
            $date = date('Y-m-d', strtotime('yesterday'));
            $query->whereRaw('DATE('.\Date::getTimezoneOffsetForSql($timezone, $field).') = "'.$date.'"');
        }
        else if ( preg_match('/_ago/', $window) ) {
            $days = str_replace('_days_ago', '', $window);
            $date = date('Y-m-d', strtotime('-'.$days.' days'));
            $query->whereRaw('DATE('.\Date::getTimezoneOffsetForSql($timezone, $field).') = "'.$date.'"');
        }
        else if ( preg_match('/last_/', $window) && preg_match('/_hours/', $window) ) {
            $amount = str_replace('last_', '', str_replace('_hours', '', $window));
            $date = date('Y-m-d');
            $created_at = date('Y-m-d H:i:s', strtotime('-'.$amount.' hours'));

            $query->whereRaw('DATE('.\Date::getTimezoneOffsetForSql($timezone, $field).') = "'.$date.'"')
                ->whereRaw('DATE('.\Date::getTimezoneOffsetForSql($timezone, $field).') >= "'.$created_at.'"');
        }
        else if ( preg_match('/last_/', $window) && preg_match('/_days/', $window) ) {
            $amount = str_replace('last_', '', str_replace('_days', '', $window));

            $start_date = date('Y-m-d', strtotime('-'.$amount.' days'));
            $end_date = date('Y-m-d 23:59:59');

            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' >= "'.$start_date.'"');
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' <= "'.$end_date.'"');
        }
        else if ( $window == 'current_month' ) {
            $start_date = date('Y-m-01 00:00:00');
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' >= "'.$start_date.'"');
        }
        else if ( $window == 'last_month' ) {
            $start_date = date('Y-m-01 00:00:00', strtotime('-1 month'));
            $end_date = date('Y-m-t 23:59:59', strtotime('-1 month'));
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' >= "'.$start_date.'"');
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' <= "'.$end_date.'"');
        }
        else if ( $window == 'lifetime' ) {
            //no condition
        }
        else if ( preg_match('/\:/', $window) ) {
            $exp = explode(':', $window);
            $start_date = $exp[0];
            $end_date = $exp[1];

            $start_date = date('Y-m-d 00:00:00', strtotime($start_date));
            $end_date = date('Y-m-d 23:59:59', strtotime($end_date));
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' >= "'.$start_date.'"');
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' <= "'.$end_date.'"');
        }
        else {
            $start_date = date('Y-m-d 00:00:00', strtotime($window));
            $end_date = date('Y-m-d 23:59:59', strtotime($window));
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' >= "'.$start_date.'"');
            $query->whereRaw(\Date::getTimezoneOffsetForSql($timezone, $field).' <= "'.$end_date.'"');
        }
    }
}
