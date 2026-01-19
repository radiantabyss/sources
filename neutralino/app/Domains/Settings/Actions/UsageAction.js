let self = {
    async run() {
        return Response.success(await Storage.get('usage') || 1);
    },
}

export default self;
