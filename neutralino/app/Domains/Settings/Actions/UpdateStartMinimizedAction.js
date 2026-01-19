let self = {
    async run() {
        let data = Invoked.all();
        await Storage.set('start_minimized', data.start_minimized);
    },
}

export default self;
