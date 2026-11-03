//Storage's counterpart for secrets, backed by the Android Keystore / iOS Keychain.
//Values are JSON-encoded here rather than by the plugin, so nothing (dates especially)
//is converted behind our back.
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

const self = {
    async get(key) {
        let stored = await SecureStorage.getItem(key);
        return stored === null ? null : JSON.parse(stored);
    },

    async set(key, value) {
        await SecureStorage.setItem(key, JSON.stringify(value));
    },

    async remove(key) {
        await SecureStorage.removeItem(key);
    },

    async clear() {
        await SecureStorage.clear();
    },
};

export default self;
