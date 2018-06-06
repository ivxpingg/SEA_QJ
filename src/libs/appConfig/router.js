/**
 * Created by sgj on 2018-3-28.
 */

export default [
    {
        path: '/home',
        // alias: '/ThemeApp',
        meta: {
            requireAuth: false,
            title: '厦门观测装备全景分析'
        },
        component: (resolve) => require(['../../views/Home/home.vue'], resolve),
        children: [{
            path: 'mapShow',
            name: 'mapShow',
            meta: {
                requireAuth: false,
                title: '厦门观测装备全景分析'
            },
            component: (resolve) => require(['../../components/home/content/mapShow.vue'], resolve)
        },{
            path: 'index',
            name: 'index',
            // alias: '/ThemeApp',
            meta: {
                requireAuth: false,
                title: '厦门观测装备全景分析'
            },
            component: (resolve) => require(['../../components/home/content/content.vue'], resolve)
        },{
            path: 'cloudService',
            name: 'cloudService',
            meta: {
                requireAuth: false,
                title: '厦门观测装备全景分析'
            },
            component: (resolve) => require(['../../components/home/content/cloudService.vue'], resolve)
        },{
            path: 'industryData',
            name: 'industryData',
            // alias: '/ThemeApp',
            meta: {
                requireAuth: false,
                title: '厦门观测装备全景分析'
            },
            component: (resolve) => require(['../../components/home/content/industryData.vue'], resolve)
        }]
    },

    {
        path: '/person',
        name: 'person',
        // alias: '/ThemeApp',
        meta: {
            requireAuth: true,
            title: '个人中心'
        },
        component: (resolve) => require(['../../views/Person/person.vue'], resolve),
        children: [{
            path: 'cloudServiceManage',
            name: 'cloudServiceManage',
            meta: {
                requireAuth: true,
                title: '个人中心'
            },
            component: (resolve) => require(['../../components/person/module/cloudServiceManage.vue'], resolve)
        },{
            path: 'industryDataManage',
            name: 'industryDataManage',
            meta: {
                requireAuth: true,
                title: '个人中心'
            },
            component: (resolve) => require(['../../components/person/module/industryDataManage.vue'], resolve)
        },{
            path: 'invoiceManage',
            name: 'invoiceManage',
            meta: {
                requireAuth: true,
                title: '个人中心'
            },
            component: (resolve) => require(['../../components/person/module/invoiceManage.vue'], resolve)
        },{
            path: 'messageManage',
            name: 'messageManage',
            meta: {
                requireAuth: true,
                title: '个人中心'
            },
            component: (resolve) => require(['../../components/person/module/messageManage.vue'], resolve)
        },{
            path: 'orderManage',
            name: 'orderManage',
            meta: {
                requireAuth: true,
                title: '个人中心'
            },
            component: (resolve) => require(['../../components/person/module/orderManage.vue'], resolve)
        },{
            path: 'personInfoMange',
            name: 'personInfoMange',
            meta: {
                requireAuth: true,
                title: '个人中心'
            },
            component: (resolve) => require(['../../components/person/module/personInfoMange.vue'], resolve)
        },{
            path: 'workOrderManage',
            name: 'workOrderManage',
            meta: {
                requireAuth: true,
                title: '个人中心'
            },
            component: (resolve) => require(['../../components/person/module/workOrderManage.vue'], resolve)
        }]
    },
    {
        path: '/manage',
        name: 'manage',
        meta: {
            requireAuth: true,
            title: '后台管理'
        },
        component: (resolve) => require(['../../views/Manage/manage.vue'], resolve),
        children: [
            {
                path: 'mcloudServeManage',
                name: 'mcloudServeManage',
                meta: {
                    requireAuth: true,
                    title: '云服务器订单'
                },
                component: (resolve) => require(['../../components/manage/module/cloudServeManage.vue'], resolve)
            },
            {
                path: 'mdataResourceMange',
                name: 'mdataResourceMange',
                meta: {
                    requireAuth: true,
                    title: '数据资源管理'
                },
                component: (resolve) => require(['../../components/manage/module/dataResourceMange.vue'], resolve)
            },
            {
                path: 'mindustryDataManage',
                name: 'mindustryDataManage',
                meta: {
                    requireAuth: true,
                    title: '行业数据订单'
                },
                component: (resolve) => require(['../../components/manage/module/industryDataManage.vue'], resolve)
            },
            {
                path: 'minvoiceApplyManage',
                name: 'minvoiceApplyManage',
                meta: {
                    requireAuth: true,
                    title: '发票申请管理'
                },
                component: (resolve) => require(['../../components/manage/module/invoiceApplyManage.vue'], resolve)
            },
            {
                path: 'mseaSystem',
                name: 'mseaSystem',
                meta: {
                    requireAuth: true,
                    title: '全景观测分析'
                },
                component: (resolve) => require(['../../components/manage/module/seaSystem.vue'], resolve)
            },
            {
                path: 'mserverManage',
                name: 'mserverManage',
                meta: {
                    requireAuth: true,
                    title: '服务器管理'
                },
                component: (resolve) => require(['../../components/manage/module/serverManage.vue'], resolve)
            },
            {
                path: 'mslideshowManage',
                name: 'mslideshowManage',
                meta: {
                    requireAuth: true,
                    title: '轮播图管理'
                },
                component: (resolve) => require(['../../components/manage/module/slideshowManage.vue'], resolve)
            },
            {
                path: 'muserManage',
                name: 'muserManage',
                meta: {
                    requireAuth: true,
                    title: '用户管理'
                },
                component: (resolve) => require(['../../components/manage/module/userManage.vue'], resolve)
            },
            {
                path: 'muserOrderManage',
                name: 'muserOrderManage',
                meta: {
                    requireAuth: true,
                    title: '用户工单管理'
                },
                component: (resolve) => require(['../../components/manage/module/userOrderManage.vue'], resolve)
            }

        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            requireAuth: true,
            title: '厦门观测装备全景试验分析'
        },
        component: (resolve) => require(['../../views/Login/login.vue'], resolve)
    }

];