let self = {
    async run() {
        let items = await Model.Panel.findAll({
            order: ['position'],
        });
        return Response.success({ items });
    },
}

export default self;
