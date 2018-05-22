/**
 * vue-router2.0 路由配置
 **/

import VueRouter from 'vue-router';
import Routers from "./router";
import iView from 'iview';


const Title = function(title) {
    title = title ? title + '' : '';
    window.document.title = title;
};

const routerConfig = function () {
    // 路由配置
    const RouterConfig = {
        //mode: 'history',
        base: '/',
        routes: Routers
    };
    const router = new VueRouter(RouterConfig);

    /**
     * 拦截的内容
     * 1. ajax请求返回的登陆信息失效
     * 2. 路由配置需要登陆
     */
    router.beforeEach((to, from, next) => {
        // console.dir('router');
        Title(to.meta.title);
        next();

        // 目前没有拦截配置

        // if (to.path === '/' || !to.meta.requireAuth) {
        //     next();
        //     return;
        // }
        //
        //
        // if (to.meta.requireAuth) {
        //
        //     if (store.state.token) {  // 通过vuex state获取当前的token是否存在
        //         iView.LoadingBar.start();
        //         next();
        //     }
        //     else {
        //         next({
        //             path: '/',
        //             query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        //         });
        //     }
        // } else {
        //     next({
        //         path: '/',
        //         query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        //     });
        // }


    });

    router.afterEach(() => {
        iView.LoadingBar.finish();
        window.scrollTo(0, 0);
    });

    return router;
}

export default routerConfig;