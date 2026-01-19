let self = {
    async run() {
        let path = await Neutralino.os.showFolderDialog('Select Path');
        return Response.success(path);
    },
}

export default self;
