/**
 * vue-router2.0 路由配置
 **/

import VueRouter from 'vue-router';
import Routers from "./router";
import iView from 'iview';
import Cookie from '../helpers/cookies';
import Config from '../appConfig/config';

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
        iView.LoadingBar.start();


        if (to.query.token !== undefined) {
            // 登陆有效期2个小时
            var addTimes = 2 * 60 * 60 * 1000;
            Cookie.write('token', to.query.token, new Date().getTime() + addTimes);       // 前台&后台

            if(to.query.uid !== undefined) {
                Cookie.write('uid', to.query.uid, new Date().getTime() + addTimes);           // 前台&后台
            }
            else {
                Cookie.remove('uid');
            }

            if(to.query.usertype !== undefined) {
                Cookie.write('usertype', to.query.usertype, new Date().getTime() + addTimes); // 前台
            }
            else {
                Cookie.remove('usertype');
            }

            if(to.query.type !== undefined) {
                Cookie.write('type', to.query.type, new Date().getTime() + addTimes);      // 后台
            }
            else {
                Cookie.remove('type');
            }

            if(to.query.syscode !== undefined) {
                Cookie.write('syscode', to.query.syscode, new Date().getTime() + addTimes);// 后台
            }
            else {
                Cookie.remove('syscode');
            }

            // next();s
            next({
                path: to.path
            });
        }
        else if (to.meta.requireAuth && Cookie.read('token') == null) {
            if (to.path.indexOf('/manage') === 0  &&  Cookie.read('syscode') != null) {
                next();
            }

            else if (to.path.indexOf('/manage') === 0) {
                window.location.href = 'http://218.5.80.6:8091/OCEANAM/logout';
            }

            else {
                var pUrl = window.location.origin + Config[Config.env].baseUrl + '\%23'+ to.path;
                var url = "http://218.5.80.6:8070/OCEAN/api/login?url=" + pUrl;
                window.location.href = url;
                //
                // next({
                //     path: '/home/index'
                // });
            }

        }
        else {
            next();
        }



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