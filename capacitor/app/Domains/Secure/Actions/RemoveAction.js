import SecureStorage from '@/Support/SecureStorage.js';

let self = {
    async run() {
        await SecureStorage.remove(Invoked.get('key'));
    },
}

export default self;
