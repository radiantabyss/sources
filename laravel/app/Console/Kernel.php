<?php
namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [];

    protected function commands()
    {
        $this->load(__DIR__.'/../Domains/Common/Commands');

        require base_path('routes/console.php');
    }

    protected function schedule(Schedule $schedule)
    {
        $schedule->command('monitor-logs')->everyTenMinutes();
        $schedule->command('backup-db every_10_minutes')->everyTenMinutes();
        $schedule->command('backup-db hourly')->hourly();
        $schedule->command('backup-db daily')->daily();
        $schedule->command('backup-db monthly')->monthly();
        $schedule->command('clean-db-backups')->daily();
    }
}
