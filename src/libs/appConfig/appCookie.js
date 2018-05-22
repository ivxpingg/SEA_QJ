/**
 * 项目cookie设置
 * @return Object
 */
import Cookies from '../helpers/cookies';
var utils = require('../utils');
const setCookie = function (obj) {
   var name, value, expires, path, domain, secure;

    expires = new Date().getTime() + 7 * 24 * 60 * 1000;

    if(utils.isArray(obj)) {
        obj.forEach(function (val) {
            name = val.name;
            value = val.value;
            path = val.path;
            domain = val.domain;
            secure = val.secure;

            Cookies.write(name, value, expires, path, domain, secure);
        });
    }
    else if(utils.isObject(obj)) {
        name = obj.name;
        value = obj.value;
        path = obj.path;
        domain = obj.domain;
        secure = obj.secure;
        Cookies.write(name, value, expires, path, domain, secure);
    }

}

const clearCookie = function (list) {
    if(utils.isArray(list)) {
        list.forEach(function (name) {
            Cookies.remove(name);
        });
    }
}

const bCookieUserInfo = function () {
    
}

const readCookie = function (name) {
    return Cookies.read(name);
}
export default {
    setCookie,
    clearCookie,
    bCookieUserInfo,
    readCookie
};
