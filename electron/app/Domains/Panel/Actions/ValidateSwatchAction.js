import SwatchValidator from './../Validators/SwatchValidator.js';

let self = {
    async run() {
        let data = Invoke.all();

        //validate request
        let validation = SwatchValidator.run(data);
        if ( validation !== true ) {
            return Response.error(validation);
        }
    },
}

export default self;
