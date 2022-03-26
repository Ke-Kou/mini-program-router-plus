import {stringify} from "./tools";
import {logError} from "./logger";

export function path2Route() {}

export interface SysMiniRouter {
    options: Record<string, any>;
    route?: string;
    is?: string;
    path?: string;
}

/**
 * 获取系统的路由对象集合
 */
export function getSysPageRouters(): SysMiniRouter[] {
    try {
        // @ts-ignore
        return getCurrentPages();
    } catch (e) {
        throw Error('宿主环境不支持getCurrentPages方法')
    }

}

/**
 * 获取当前路由地址
 * @param router
 */
export function getRouterRoute(router: SysMiniRouter) {
    const route = router.route || router.is || router.path;
    if (route) {
        return route;
    } else {
        logError(`路由的地址获取失败: ${router}`)
        throw new Error('路由的地址获取失败');
    }
}

/**
 * 获取当前的路由
 */
export function getCurrentPageRoute() {
    const routers = getSysPageRouters();
    const currentRouter = routers[routers.length  - 1];
    return getRouterRoute(currentRouter);
}

/**
 * 连接路径和参数
 * @param route
 * @param query
 */
export function combineRouteWithQuery(route: string, query: Object) {
    const queryStr = stringify(query, { arrayFormat: 'brackets'});
    return route.indexOf('?') >= 0 ? `${route}&${queryStr}` : `${route}?${queryStr}`;
}
