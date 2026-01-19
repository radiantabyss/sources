import { spawn } from 'child_process';
import chokidar from 'chokidar';

let viteProcess;

function startViteBuild() {
    if ( viteProcess ) {
        viteProcess.kill();
    }

    viteProcess = spawn('npx', ['vite', 'build', '--watch', '--mode=development'], {
        stdio: 'inherit',
        shell: true
    });

    viteProcess.on('exit', (code) => {
        if (code !== null) {
            console.log(`vite build process exited with code ${code}`);

            //wait 2 seconds and restart it
            setTimeout(() => {
                startViteBuild();
            }, 2000)
        }
    });
}

startViteBuild();

const watcher = chokidar.watch('./app', {
    ignoreInitial: true,
    ignored: /node_modules/
});

watcher.on('add', (path) => {
    startViteBuild();
});

watcher.on('unlink', (path) => {
    startViteBuild();
});
