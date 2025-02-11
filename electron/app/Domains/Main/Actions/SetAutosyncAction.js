let self = {
    async run() {
        let data = Invoke.all();
        global.AUTOSYNC = data.autosync;
    },
}

export default self;
