let self = {
    async run() {
        let data = Invoke.all();
        global.JWT_TOKEN = data.jwt_token;
    },
}

export default self;
