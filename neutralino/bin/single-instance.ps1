param (
    [string]$process_name
)

Add-Type @"
using System;
using System.Runtime.InteropServices;

public class WinApi {
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc enum_proc, IntPtr l_param);

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint process_id);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, IntPtr process_id);

    [DllImport("user32.dll")]
    public static extern bool AttachThreadInput(uint id_attach, uint id_attach_to, bool attach);
}
"@

# --------------------------
# Get PID like WMIC
# --------------------------

$process_list = Get-CimInstance Win32_Process -Filter "name='$process_name'"

if (-not $process_list)
{
    Write-Host "Process '$process_name' not found."
    exit
}

$pids = $process_list.ProcessId

# --------------------------
# Find windows for each PID
# --------------------------

$found_windows = @()

$callback = {
    param($hwnd, $lparam)

    [uint32]$window_pid = 0
    [WinApi]::GetWindowThreadProcessId($hwnd, [ref]$window_pid)

    if ($pids -contains $window_pid)
    {
        $script:found_windows += $hwnd
    }

    return $true
}

[WinApi]::EnumWindows($callback, [IntPtr]::Zero)

# --------------------------
# Restore + focus window(s)
# --------------------------

foreach ($hwnd in $found_windows)
{
    # Restore (unhide / unminimize)
    [WinApi]::ShowWindow($hwnd, 9)

    # ---- Force focus ----
    $foreground_hwnd = [WinApi]::GetForegroundWindow()

    if ($foreground_hwnd -ne [IntPtr]::Zero)
    {
        $current_thread_id = [WinApi]::GetWindowThreadProcessId($foreground_hwnd, [IntPtr]::Zero)
        $target_thread_id = [WinApi]::GetWindowThreadProcessId($hwnd, [IntPtr]::Zero)

        if ($current_thread_id -ne $target_thread_id)
        {
            [WinApi]::AttachThreadInput($current_thread_id, $target_thread_id, $true) | Out-Null
            [WinApi]::SetForegroundWindow($hwnd) | Out-Null
            [WinApi]::AttachThreadInput($current_thread_id, $target_thread_id, $false) | Out-Null
        }
        else
        {
            [WinApi]::SetForegroundWindow($hwnd) | Out-Null
        }
    }
}
