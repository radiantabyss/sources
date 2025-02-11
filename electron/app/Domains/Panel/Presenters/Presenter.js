let self = {
    run(item) {
        item.swatches = decode_json(item.swatches);
        item.theme_settings = decode_json(item.theme_settings);
        item.window_settings = decode_json(item.window_settings);

        return item;
    },
}

export default self;
