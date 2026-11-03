let self = {
    async run() {
        let settings = {
            ...await Storage.get('settings'),
            ...Invoked.all(),
        };

        await Storage.set('settings', settings);

        return Response.success(settings);
    },
}

export default self;
