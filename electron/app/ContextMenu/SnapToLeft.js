import Presenter from './../Domains/Panel/Presenters/Presenter.js';
import Aligner from './../Services/Aligner/Aligner.js';

export default function(actions, parameters, win) {
    return {
        label: 'Snap To Left',
        visible: is_panel_window(win),
        click: async () => {
            let item = await Model.Panel.find(get_panel_id_from_window(win));
            item = Presenter.run(item);
            Aligner.run('left', win, item);
        }
    }
}
