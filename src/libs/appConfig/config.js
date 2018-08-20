// import Env from './env';

let config = {
    env: process.env.NODE_ENV,
    development: {
        // domain: 'http://localhost',
        // port: '8090',
        ajaxUrl: '/oceanobservation/ocean',
        imgUrl: '/oceanobservation',
        staticUrl: '/',
        baseUrl: '/',
        path: '/',    // 用于设置cookie
        manageLogUrl: 'http://xmsoc.com:20506/OCEANAM/logout',    // 后端登陆地址
        personLogUrl: 'http://xmsoc.com:20507/OCEAN/api/login',   // 个人中心登陆地址
        homeSeaBaseUrl_person: 'http://xmsoc.com:20507',
        homeSeaBaseUrl_manage: 'http://xmsoc.com:20506'
    },
    production: {
        // domain: 'http://localhost',
        // port: '8090',
        ajaxUrl: '/oceanobservation/ocean',
        imgUrl: '/oceanobservation',
        staticUrl: '/qj/',
        baseUrl: '/qj/',
        path: '/',   // 用于设置cookie
        manageLogUrl: 'http://xmsoc.com:20506/OCEANAM/logout',
        personLogUrl: 'http://xmsoc.com:20507/OCEAN/api/login',
        homeSeaBaseUrl_person: 'http://xmsoc.com:20507',
        homeSeaBaseUrl_manage: 'http://xmsoc.com:20506'
    }
};
export default config;