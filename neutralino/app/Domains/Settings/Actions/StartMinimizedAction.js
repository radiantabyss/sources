let self = {
    async run() {
        return Response.success(await Storage.get('start_minimized') || 0);
    },
}

export default self;
