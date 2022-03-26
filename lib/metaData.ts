import {RoutesConfig} from "./router";
import {BeforeEachHandle} from "./guider";

export enum PageType {
    normal,
    tab
}

export interface RouterMetaType {
    route: string;
    pageType: PageType;
    aliasName?: string;
    // eventEmit?: any;
    beforeEnter?: BeforeEachHandle;
}

export interface RouterStackMetaType {

}

/**
 * 元数据层
 */
export default class MetaData {
    routerMeta: RouterMetaType[];
    routerStackMeta: RouterStackMetaType;

    initMetaData(config: RoutesConfig[]) {
        this.routerMeta = config.map(item => ({
            route: item.route,
            beforeEnter: item.beforeEnter,
            pageType: item.isTab ? PageType.tab : PageType.normal,
            aliasName: item.name,
        }))
    }

    getRouterMetaByRoute(route: RouterMetaType['route']) {
        if (this.routerMeta) {
            return this.routerMeta.filter(item => item.route === route)[0];
        } else {
            throw new Error('未配置routes, 请在初始化的时候配置')
        }
    }

    getRouterMetaByAliasName(name: string) {
        if (this.routerMeta) {
            return this.routerMeta.filter(item => item.aliasName === name)[0];
        } else {
            throw new Error('未配置routes, 请在初始化的时候配置')
        }
    }

    getRouterMetaBySysRoute(route: string) {
        route = route.match(/^\//) ? route : '/' + route;
        return this.getRouterMetaByRoute(route);
    }

}
