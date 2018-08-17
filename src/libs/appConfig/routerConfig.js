/**
 * vue-router2.0 路由配置
 **/

import VueRouter from 'vue-router';
import Routers from "./router";
import iView from 'iview';
import Cookie from '../helpers/cookies';
import Config from '../appConfig/config';

import Ajax from './ajax';

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
            var path = Config[Config.env].path;
            Cookie.write('sea_qj_token', to.query.token, new Date().getTime() + addTimes, path);       // 前台&后台

            if(to.query.uid !== undefined) {
                Cookie.write('sea_qj_uid', to.query.uid, new Date().getTime() + addTimes, path);           // 前台&后台
            }
            else {
                Cookie.remove('sea_qj_uid');
            }

            if(to.query.usertype !== undefined) {
                Cookie.write('sea_qj_type', '', new Date().getTime() - addTimes, path);
                Cookie.write('sea_qj_usertype', to.query.usertype, new Date().getTime() + addTimes, path); // 前台
            }
            else {
                Cookie.remove('sea_qj_usertype');
            }

            if(to.query.type !== undefined) {
                Cookie.write('sea_qj_usertype', '', new Date().getTime() - addTimes, path);
                Cookie.write('sea_qj_type', to.query.type, new Date().getTime() + addTimes, path);      // 后台
            }
            else {
                Cookie.remove('sea_qj_type');
            }

            if(to.query.syscode !== undefined) {
                Cookie.write('sea_qj_syscode', to.query.syscode, new Date().getTime() + addTimes, path);// 后台
            }
            else {
                Cookie.remove('sea_qj_syscode');
            }


            if (to.query.type === '3') {
                // 获取用户信息
                new Promise((resolve => {
                    Ajax({
                        method: 'get',
                        url: '/auth/getUserInfoById',
                        params: {
                            type: to.query.type,
                            uid: to.query.uid,
                            token: to.query.token
                        }
                    }).then(function(response) {
                        if(response.status === 1) {
                            Cookie.write('sea_qj_account', response.result.account, new Date().getTime() + addTimes, path);
                        }
                        resolve();

                    }).catch(function (e) {

                    })
                })).then(function () {
                    next({
                        path: to.path
                    });
                }).catch(function () {
                })
            }
            else {
                next({
                    path: to.path
                });
            }


            // next();s
            // next({
            //     path: to.path
            // });
        }
        else if (to.meta.requireAuth && Cookie.read('sea_qj_token') == null) {

            if (to.path.indexOf('/manage') === 0  &&  Cookie.read('syscode') != null) {
                next();
            }

            else if (to.path.indexOf('/manage') === 0) {
                window.location.href =  Config[Config.env].manageLogUrl;
            }

            else {
                var pUrl = window.location.origin + Config[Config.env].baseUrl + '\%23'+ to.path;
                var url = Config[Config.env].personLogUrl + "?url=" + pUrl;
                window.location.href = url;
            }

        }
        else {
            next();
        }

    });

    router.afterEach(() => {
        iView.LoadingBar.finish();
        window.scrollTo(0, 0);
    });

    return router;
}

export default routerConfig;