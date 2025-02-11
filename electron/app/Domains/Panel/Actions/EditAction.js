import EditPresenter from './../Presenters/EditPresenter.js';

let self = {
    async run(id) {
        let item = await Model.Panel.find(id);
        if ( !item ) {
            return Response.error('Panel not found.');
        }

        item = EditPresenter.run(item);
        return Response.success({ item });
    },
}

export default self;
