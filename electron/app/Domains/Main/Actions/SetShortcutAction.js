import Shortcut from './../../../Modules/Shortcut.js';

let self = {
    async run() {
        let data = Invoke.all();
        Shortcut.unregister(data.old);
        Shortcut.register(data.type, data.new);
    },
}

export default self;
