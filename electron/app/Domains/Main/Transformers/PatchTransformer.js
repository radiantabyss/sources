let self = {
    allowed_fileds: ['transparency_amount'],

    run(data) {
        for ( let key in data ) {
            if ( !self.allowed_fileds.includes(key) ) {
                delete data[key];
            }
        }
        
        return data;
    },
}

export default self;
