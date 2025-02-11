let self = {
    async run(id) {
        let item = await Model.Panel.find(id);
        if ( !item ) {
            return Response.error('Panel not found.');
        }

        Model.Panel.destroy({
            where: { id }
        });

        if ( AUTOSYNC ) {
            Request.get(`/panel/delete/${id}`);
        }
    },
}

export default self;
