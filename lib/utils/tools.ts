import {NavigatorParams} from "../navigator";
import * as qs from 'qs/lib';

export function navigatorCall2Promise<T>(fn) {
    return (config: NavigatorParams) => new Promise<T>(((resolve, reject) => {
        const successHandle = config.success;
        const failHandle = config.fail;
        config.success = (value: T) => {
            successHandle && successHandle.call(this, value);
            resolve(value);
        };
        config.fail = (res: any) => {
            failHandle && failHandle.call(this, res);
            reject(res);
        }
        fn.call(this, config)
    }))
}

/**
 * 对象转字符串
 */
export function stringify(obj: Object, options: any = {}) {
    return qs.stringify(obj, options)
}

/**
 * 字符串转对象
 */
export function parse(str: string, options: any = {}) {
    return qs.parse(str, options);
}
