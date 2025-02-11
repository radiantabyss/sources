import PanelWindow from './../../../Windows/PanelWindow.js';
import CustomTheme from './../../../Services/CustomTheme.js';
import Presenter from './../Presenters/Presenter.js';

let self = {
    async run(id) {
        let item = await Model.Panel.find(id);
        if ( !item ) {
            return Response.error('Panel not found.');
        }

        item = Presenter.run(item);
        CustomTheme.update(item);
        PanelWindow.create(item);
    },
}

export default self;
