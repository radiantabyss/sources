let self = {
    run(data) {
        //validate request params
        let validation = Validator.make(data, {
            'name': 'required',
            'icon': 'required',
        }, {
            'name.required': 'Swatch Name is required.',
            'icon.required': 'Swatch Icon is required.',
        });

        if ( !validation.passes() ) {
            return validation.messages();
        }

        return true;
    },
}

export default self;
