import { exec, spawn } from 'child_process';

let self = {
    logs: {},
    services: {},

    async run(panel, swatch) {
        let options = {};
        if ( swatch.cwd ) {
            options.cwd = swatch.cwd;
        }

        if ( !self.logs[swatch.id] ) {
            self.logs[swatch.id] = {};
        }

        for ( let command of swatch.commands ) {
            if ( !self.logs[swatch.id][command.id] ) {
                self.logs[swatch.id][command.id] = [];
            }

            if ( command.is_service ) {
                await self.spawn(panel, swatch, command, options);

            }
            else if ( swatch.sequential_commands ) {
                await self.execSync(panel, swatch, command, options);
            }
            else {
                self.exec(panel, swatch, command, options);
            }
        }
    },

    async spawn(panel, swatch, command, options) {
        //check if process is already running, then stop it
        if ( self.services[command.id] ) {
            try {
                await tree_kill_promise(self.services[command.id].pid);
            }
            catch(e) {}

            self.logs[swatch.id][command.id] = [];
            ipc_send('swatch:service-stop', { swatch, command }, PANEL_WINDOWS[panel.id]);
            delete self.services[command.id];

            return;
        }

        let args = command.command.trim().split(' ');
        let command_without_args = args[0];
        args.shift();
        options.shell = true;
        self.services[command.id] = spawn(command_without_args, args, options);
        ipc_send('swatch:service-start', { swatch, command }, PANEL_WINDOWS[panel.id]);

        //bind events
        self.services[command.id].on('close', (code) => {
            self.logs[swatch.id][command.id].push(`Exited with code: ${code}`);
            try {
                ipc_send('swatch:service-stop', { swatch, command }, PANEL_WINDOWS[panel.id]);
            }
            catch(e) {}

            delete self.services[command.id];
        });

        self.services[command.id].stdout.on('data', (data) => {
            data = data.toString();
            self.logs[swatch.id][command.id].push(data);
        });

        self.services[command.id].stderr.on('data', (data) => {
            data = data.toString();
            self.logs[swatch.id][command.id].push(data);
            try {
                ipc_send('swatch:service-error', { swatch, command, data }, PANEL_WINDOWS[panel.id]);
            }
            catch(e) {}
        });
    },

    async execSync(panel, swatch, command, options) {
        try {
            const { stdout, stderr } = await exec_promise(command.command, options);
            if ( stdout ) {
                self.logs[swatch.id][command.id].push(stdout);
            }

            if ( stderr ) {
                self.logs[swatch.id][command.id].push(stderr);
            }
        }
        catch(e) {
            self.logs[swatch.id][command.id].push(`${e.error.message} ${e.stdout} ${e.stderr}`);
        }
    },

    exec(panel, swatch, command, options) {
        exec(command.command, options, (error, stdout, stderr) => {
            if ( error ) {
                self.logs[swatch.id][command.id].push(error.message);
            }

            if ( stdout ) {
                self.logs[swatch.id][command.id].push(stdout);
            }

            if ( stderr ) {
                self.logs[swatch.id][command.id].push(stderr);
            }
        });
    },
};

export default self;
