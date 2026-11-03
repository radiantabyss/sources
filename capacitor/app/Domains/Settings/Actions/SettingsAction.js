let self = {
    async run() {
        return Response.success(await Storage.get('settings') || {});
    },
}

export default self;
