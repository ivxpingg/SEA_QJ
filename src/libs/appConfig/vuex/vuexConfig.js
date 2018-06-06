import Vuex from 'vuex';

const store = function () {
    return new Vuex.Store({
        state: {
            token: null,     // 前台和后台共用
            uid: null,       // 前台和后台共用
            usertype: null,  // 前台参数
            type: null,      // 后台参数
            syscode: null    // 后台参数

        },
        getters: {},
        mutations: {
            setToken(state, token) {
                state.token = token;
            },
            setUid(state, uid) {
                state.uid = uid;
            },
            setUsertype(state, usertype) {
                state.usertype = usertype;
            },
            setType(state, type) {
                state.type = type;
            },
            setSyscode(state, syscode) {
                state.syscode = syscode;
            }
        },
        actions: {

        }
    });
}

export default store;
