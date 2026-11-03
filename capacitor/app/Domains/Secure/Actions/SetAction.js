import SecureStorage from '@/Support/SecureStorage.js';

let self = {
    async run() {
        await SecureStorage.set(Invoked.get('key'), Invoked.get('value'));
    },
}

export default self;
