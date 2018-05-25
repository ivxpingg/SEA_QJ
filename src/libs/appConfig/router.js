/**
 * Created by sgj on 2018-3-28.
 */

export default [
    {
        path: '/home',
        // alias: '/ThemeApp',
        requireAuth: false,
        meta: {
            title: '厦门观测装备全景试验分析'
        },
        component: (resolve) => require(['../../views/Home/home.vue'], resolve),
        children: [{
            path: 'index',
            name: 'index',
            // alias: '/ThemeApp',
            requireAuth: false,
            meta: {
                title: '厦门观测装备全景试验分析'
            },
            component: (resolve) => require(['../../components/home/content/content.vue'], resolve)
        },{
            path: 'cloudService',
            name: 'cloudService',
            // alias: '/ThemeApp',
            requireAuth: false,
            meta: {
                title: '厦门观测装备全景试验分析'
            },
            component: (resolve) => require(['../../components/home/content/cloudService.vue'], resolve)
        },{
            path: 'industryData',
            name: 'industryData',
            // alias: '/ThemeApp',
            requireAuth: false,
            meta: {
                title: '厦门观测装备全景试验分析'
            },
            component: (resolve) => require(['../../components/home/content/industryData.vue'], resolve)
        }]
    },

    {
        path: '/person',
        name: 'person',
        // alias: '/ThemeApp',
        requireAuth: false,
        meta: {
            title: '厦门观测装备全景试验分析'
        },
        component: (resolve) => require(['../../views/Person/person.vue'], resolve),
        children: [{
            path: 'industryData',
            name: 'industryData',
            // alias: '/ThemeApp',
            requireAuth: false,
            meta: {
                title: '厦门观测装备全景试验分析'
            },
            component: (resolve) => require(['../../components/home/content/industryData.vue'], resolve)
        }]
    },

    {
        path: '/login',
        name: 'login',
        // alias: '/ThemeApp',
        requireAuth: false,
        meta: {
            title: '厦门观测装备全景试验分析'
        },
        component: (resolve) => require(['../../views/Login/login.vue'], resolve)
    }

];