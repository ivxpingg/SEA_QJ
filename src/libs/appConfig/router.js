/**
 * Created by sgj on 2018-3-28.
 */

export default [
    {
        path: '/',
        // alias: '/ThemeApp',
        requireAuth: false,
        meta: {
            title: '厦门观测装备全景试验分析'
        },
        component: (resolve) => require(['../../views/Home/home.vue'], resolve)
    }

];