<?php
namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use RA\Domains\Common\Commands\BackupDBCommand;
use RA\Domains\Common\Commands\CleanDBBackupsCommand;
use RA\Domains\Common\Commands\ImportDBBackupCommand;
use RA\Domains\Common\Commands\MonitorLogsCommand;
use RA\Auth\Domains\Team\Commands\PruneInvitesCommand;
use RA\Auth\Domains\User\Commands\PruneCodesCommand;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        BackupDBCommand::class,
        CleanDBBackupsCommand::class,
        ImportDBBackupCommand::class,
        MonitorLogsCommand::class,
        PruneInvitesCommand::class,
        PruneeCodesCommand::class,
    ];

    protected function commands()
    {
        $this->load(__DIR__.'/../Domains/Common/Commands');

        require base_path('routes/console.php');
    }

    protected function schedule(Schedule $schedule)
    {
        $schedule->command('ra:monitor-logs')->everyTenMinutes();
        $schedule->command('ra:backup-db every_10_minutes')->everyTenMinutes();
        $schedule->command('ra:backup-db hourly')->hourly();
        $schedule->command('ra:backup-db daily')->daily();
        $schedule->command('ra:backup-db monthly')->monthly();
        $schedule->command('ra:clean-db-backups')->daily();

        $schedule->command('ra-auth:prune-invites')->daily();
        $schedule->command('ra-auth:prune-codes')->daily();
    }
}
