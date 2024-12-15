let self = {
    register() {
        Gate.define('type', (type) => {
            let types = type.split('|');
            types.push('super_admin');
            return types.includes(Auth.user.type);
        });

        Gate.define('role', (role) => {
            let roles = role.split('|');
            roles.push('owner');
            return roles.includes(Auth.user.team.role);
        });

        Gate.define('delete-timereport', (item) => {
            //check type
            if ( Auth.user.type == 'client' ) {
                return false;
            }

            //check if it belongs to the user
            if ( Auth.user.id != item.user_id ) {
                return false;
            }

            //check if it's old
            let date = new Date();
            date.setDate(date.getDate() - 2);
            if ( new Date(item.created_at) < date ) {
                return false;
            }

            return true;
        });

        Gate.define('delete-invoice', (item) => {
            //check type
            if ( Auth.user.type == 'client' ) {
                return false;
            }

            //check if it's old
            let date = new Date();
            date.setDate(date.getDate() - 2);
            if ( new Date(item.created_at) < date ) {
                return false;
            }

            return true;
        });

        Gate.define('set-invoice-status', (item) => {
            //check type
            if ( Auth.user.type == 'client' ) {
                return false;
            }

            if ( item.status == 'paid' ) {
                return false;
            }

            return true;
        });
    },
};

export default self;
