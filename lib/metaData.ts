import {RoutesConfig} from "./router";
import {BeforeEachHandle} from "./guider";

export enum PageType {
    normal,
    tab
}

export interface RouterMetaType {
    route: string;
    eventEmit?: any;
    beforeEnter?: BeforeEachHandle;
    pageType: PageType;
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
        }))
    }

    getRouterMetaByRoute(route: RouterMetaType['route']) {
        if (this.routerMeta) {
            return this.routerMeta.filter(item => item.route === route)[0];
        } else {
            throw new Error('未配置routes')
        }
    }

    getRouterMetaBySysRoute(route: string) {
        route = route.match(/^\//) ? route : '/' + route;
        return this.getRouterMetaByRoute(route);
    }

}
