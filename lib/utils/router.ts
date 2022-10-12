import {stringify} from "./tools";
import {logError} from "./logger";

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
 * 获取路由地址 /page/path
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
 * 根据路由栈index获取路由地址
 * @param index 大于等于0时从栈底数返回, 小于0时从栈顶数返回
 */
export function getSysPageRoute(index = -1) {
    const routers = getSysPageRouters();
    let step = index >= 0 ? index : routers.length + index;
    const router = routers[step >= 0 && step < routers.length ? step : 0];
    return getRouterRoute(router);
}

/**
 * 获取当前的路由
 */
export function getCurrentPageRoute() {
    return getSysPageRoute();
    // const routers = getSysPageRouters();
    // const currentRouter = routers[routers.length  - 1];
    // return getRouterRoute(currentRouter);
}

/**
 * 获取当前系统路由option
 */
export function getCurrentPagesOptions() {
   const routes = getSysPageRouters();
   return routes[routes.length - 1].options;
}

/**
 * 将路径补全为绝对路径
 * @param route
 */
export function completionPathWithAbsolute(route: string) {
    return route.match(/^\//) ? route : '/' + route;
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

/**
 * 判断两个路径是否相等
 * @param path1
 * @param path2
 */
export function pathEquals(path1: string, path2: string) {
    return completionPathWithAbsolute(path1) === completionPathWithAbsolute(path2);
}
