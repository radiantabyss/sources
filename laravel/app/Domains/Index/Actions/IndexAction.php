<?php
namespace App\Domains\Index\Actions;

use Illuminate\Routing\Controller as Action;
use RA\Response;

class IndexAction extends Action
{
    public function run() {
        return Response::success();
    }
}
