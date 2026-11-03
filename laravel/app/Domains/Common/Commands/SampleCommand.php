<?php
namespace App\Domains\Common\Commands;

use Illuminate\Console\Command;
use App\Models as Model;

class SampleCommand extends Command
{
    protected $signature = 'sample';
    protected $description = 'Does nothing';

    public function handle() {
        echo 'hello';
    }
}
