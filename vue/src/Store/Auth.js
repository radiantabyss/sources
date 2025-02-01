export default {
    namespaced: true,
    state: {
        user: false,
        teams: false,
    },
    mutations: {
        SET: (state, value) => {
            state.user = value;
        },

        UPDATE: (state, value) => {
            state.user = {...state.user, ...value};
        },

        SET_TEAMS: (state, value) => {
            state.teams = value;
        },

        ADD_TEAM: (state, value) => {
            state.teams = Items.add(state.teams, value);
        },

        UPDATE_TEAM: (state, value) => {
            if ( state.user.team.id == value.id ) {
                state.user = Item.setKey(state.user, 'team', value);
            }

            state.teams = Items.replace(state.teams, value);
        },

        DELETE_TEAM: (state, value) => {
            state.teams = Items.delete(state.teams, value);
        },
    },
}
