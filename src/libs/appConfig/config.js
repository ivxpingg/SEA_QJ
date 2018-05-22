import Env from './env';

let config = {
    env: Env,
    development: {
        // domain: 'http://localhost',
        // port: '8090',
        baseUrl: '/oceanobservation',
        staticUrl: '/'
    },
    production: {
        // domain: 'http://localhost',
        // port: '8090',
        baseUrl: '/oceanobservation',
        staticUrl: '/'
    }
};
export default config;