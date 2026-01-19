let self = {
    string_to_id(input, length = 10) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // FNV-1a hash
        let hash = 0x811c9dc5;
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = (hash * 0x01000193) >>> 0;
        }

        // Convert hash to base62
        let id = '';
        do {
            id = chars[hash % 62] + id;
            hash = Math.floor(hash / 62);
        } while (hash > 0);

        // Pad or trim to desired length
        if (id.length < length) {
            id = id.padStart(length, '0');
        }
        else {
            id = id.slice(0, length);
        }

        return id;
    },

    async open_file(file) {
        if ( await file_exists('C:/Program Files/Notepad++/notepad++.exe') ) {
            await Neutralino.os.execCommand(`"C:/Program Files/Notepad++/notepad++.exe" "${file}"`, {
                background: true,
            });
        }
        else if ( await file_exists('C:/Program Files (x86)/Notepad++/notepad++.exe') ) {
            await Neutralino.os.execCommand(`"C:/Program Files (x86)/Notepad++/notepad++.exe" "${file}"`, {
                background: true,
            });
        }
        else {
            await Neutralino.os.execCommand(`%windir%\system32\notepad.exe "${file}"`, {
                background: true,
            });
        }
    },
}

export default self;
