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

        Gate.define('owns-team', (team = null) => {
            if ( !team ) {
                team = Auth.user.team;
            }

            return team.role == 'owner';
        });

        Gate.define('manage-team', (team = null) => {
            if (Auth.user.type == 'super_admin' ) {
                return true;
            }

            if ( !team ) {
                team = Auth.user.team;
            }

            return ['owner', 'admin'].includes(team.role);
        });
    },
};

export default self;
