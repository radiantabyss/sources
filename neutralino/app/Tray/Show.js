let self = {
    run() {
        if ( WINDOW_TYPE != 'main' ) {
            return;
        }

        Neutralino.window.show();
    }
};

export default self;
