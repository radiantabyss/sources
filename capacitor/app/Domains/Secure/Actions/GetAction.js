import SecureStorage from '@/Support/SecureStorage.js';

let self = {
    async run() {
        return Response.success(await SecureStorage.get(Invoked.get('key')));
    },
}

export default self;
