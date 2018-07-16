import Env from './env';

let config = {
    env: Env,
    development: {
        // domain: 'http://localhost',
        // port: '8090',
        ajaxUrl: '/oceanobservation/ocean',
        imgUrl: '/oceanobservation',
        staticUrl: '/',
        baseUrl: '/',
        path: '/'    // 用于设置cookie
    },
    production: {
        // domain: 'http://localhost',
        // port: '8090',
        ajaxUrl: '/oceanobservation/ocean',
        imgUrl: '/oceanobservation',
        staticUrl: '/qj/',
        baseUrl: '/qj/',
        path: '/'    // 用于设置cookie
    }
};
export default config;