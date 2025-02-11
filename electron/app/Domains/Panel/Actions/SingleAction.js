import Presenter from './../Presenters/Presenter.js';

let self = {
    async run(id) {
        let item = await Model.Panel.find(id);
        if ( !item ) {
            return Response.error('Panel not found.');
        }

        item = Presenter.run(item);
        return Response.success({ item });
    },
}

export default self;
