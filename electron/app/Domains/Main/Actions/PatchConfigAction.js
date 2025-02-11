import PatchTransformer from './../Transformers/PatchTransformer.js';

let self = {
    async run() {
        let data = Invoke.all();
        data = PatchTransformer.run(data);

        Config.set('settings', {
            ...Config.get('settings'),
            ...data,
        });
    },
}

export default self;
