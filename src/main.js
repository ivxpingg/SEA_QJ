import Vue from 'vue';
import iView from 'iview';
import App from './App.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Ajax from './libs/appConfig/ajax';
import RouterConfig from './libs/appConfig/routerConfig';
import Store from './libs/appConfig/vuex/vuexConfig';
import 'iview/dist/styles/iview.css';
import './libs/iconfont/iconfont.css';
import Cookie from './libs/helpers/cookies';
import './style/app.scss';

// console.log(process.env.BASE_URL);

Vue.config.productionTip = false;
Vue.prototype.$http = Ajax;

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Vuex);

const router = RouterConfig();
const store = Store();
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    created() {
        this.$store.commit('setToken', Cookie.read('sea_qj_token'));
        this.$store.commit('setUid', Cookie.read('sea_qj_uid'));
        this.$store.commit('setUsertype', Cookie.read('sea_qj_usertype'));
        this.$store.commit('setType', Cookie.read('sea_qj_type'));
        this.$store.commit('setSyscode', Cookie.read('sea_qj_syscode'));
    },
    mounted() {}
});
