let self = {
    mask(str) {
        if ( !str.length ) {
            return;
        }

        let visible_chars_left = 0;
        let visible_chars_right = 0;

        if ( str.length > 6 ) {
            visible_chars_left = 2;
        }

        if ( str.length > 10 ) {
            visible_chars_right = 2;
        }
        if ( str.length > 20 ) {
            visible_chars_left = 3;
            visible_chars_left = 3;
        }

        let bullet_count = str.length - visible_chars_left - visible_chars_right;
        if ( bullet_count < 0 ) {
            bullet_count = str.length;
        }

        if ( bullet_count > 10 ) {
            bullet_count = 10;
        }

        return str.substring(0, visible_chars_left) + '⁕'.repeat(bullet_count) + str.substring(str.length - visible_chars_right);
    },
}

export default self;
