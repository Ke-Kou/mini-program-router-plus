import {RoutesConfig} from "./router";
import {BeforeEachHandle} from "./guider";
import {completionPathWithAbsolute} from "./utils/router";

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
    protected routerMeta: RouterMetaType[];
    protected routerStackMeta: RouterStackMetaType;

    protected initMetaData(config: RoutesConfig[]) {
        this.routerMeta = config.map(item => ({
            route: item.route,
            beforeEnter: item.beforeEnter,
            pageType: item.isTab ? PageType.tab : PageType.normal,
            aliasName: item.name,
        }))
    }

    protected getRouterMetaByRoute(route: RouterMetaType['route']) {
        if (this.routerMeta) {
            return this.routerMeta.filter(item => item.route === route)[0];
        } else {
            throw new Error('未配置routes, 请在初始化的时候配置')
        }
    }

    protected getRouterMetaByAliasName(name: string) {
        if (this.routerMeta) {
            return this.routerMeta.filter(item => item.aliasName === name)[0];
        } else {
            throw new Error('未配置routes, 请在初始化的时候配置')
        }
    }

    protected getRouterMetaBySysRoute(route: string) {
        route = completionPathWithAbsolute(route);
        return this.getRouterMetaByRoute(route);
    }

}
