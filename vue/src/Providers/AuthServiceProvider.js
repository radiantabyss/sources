import Gates from '@/Support/Gates';

const SetUser = () => {
    return new Promise(async (resolve) => {
        //check if user was already set
        if ( Store.state.Auth.user !== false ) {
            return resolve();
        }

        //check if jwt token exists
        if ( !localStorage.getItem('jwt_token') ) {
            Store.commit('Auth/SET', null);
            return resolve();
        }

        //try to get user
        try {
            let data = await Request.get('/auth/user/get');
            Store.commit('Auth/SET', data.item);
            resolve();
        }
        catch(e) {
            //jwt token is invalid, remove it
            localStorage.removeItem('jwt_token');
            Store.commit('Auth/SET', null);
            resolve();
        }
    });
}

export default async () => {
    await SetUser();
    Gates.register();
}
