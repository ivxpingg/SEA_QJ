import Vuex from 'vuex';

const store = function () {
    return new Vuex.Store({
        state: {
            token: null,
            name: ''
        },
        getters: {},
        mutations: {
            setToken(state, token) {
                state.token = token;
            },
            setName(state, name) {
                state.name = name;
            }
        },
        actions: {

        }
    });
}

export default store;
