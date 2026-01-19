let self = {
    async run() {
        let data = Invoked.all();
        await Storage.set('usage', data.usage);
    },
}

export default self;
