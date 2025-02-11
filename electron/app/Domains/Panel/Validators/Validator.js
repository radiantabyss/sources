let self = {
    async run(data, id = null) {
        //check if item exists
        if ( id ) {
            let item = await Model.Panel.find();
            if ( !item ) {
                return `Panel not found.`;
            }
        }

        let validation = Validator.make(data, {
            'name': 'required',
            'icon': 'required',
        }, {
            'name.required': 'Name is required.',
            'icon.required': 'Icon is required.',
        });

        if ( !validation.passes() ) {
            return validation.messages();
        }

        return true;
    },
}

export default self;
