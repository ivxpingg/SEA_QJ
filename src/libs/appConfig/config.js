import Env from './env';

let config = {
    env: Env,
    development: {
        // domain: 'http://localhost',
        // port: '8090',
        ajaxUrl: '/oceanobservation/ocean',
        imgUrl: '/oceanobservation',
        staticUrl: '/',
        baseUrl: '/'
    },
    production: {
        // domain: 'http://localhost',
        // port: '8090',
        ajaxUrl: '/oceanobservation/ocean',
        imgUrl: '/oceanobservation',
        staticUrl: '/',
        baseUrl: '/'
    }
};
export default config;