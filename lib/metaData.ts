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


/**
 * 元数据层
 */
export default class MetaData {
    protected routerMeta: RouterMetaType[];

    /**
     * 首次初始化meta队列
     * @param config
     * @protected
     */
    protected initMetaData(config: RoutesConfig[]) {
        this.routerMeta = config.map(item => ({
            route: item.route,
            beforeEnter: item.beforeEnter,
            pageType: item.isTab ? PageType.tab : PageType.normal,
            aliasName: item.name,
        }))
    }

    /**
     * 获取meta信息 by route地址
     * @param route
     * @protected
     */
    protected getRouterMetaByRoute(route: RouterMetaType['route']) {
        if (this.routerMeta) {
            return this.routerMeta.filter(item => item.route === route)[0];
        } else {
            throw new Error('未配置routes, 请在初始化的时候配置')
        }
    }

    /**
     * 获取meta信息 by aliasName属性
     * @param name
     * @protected
     */
    protected getRouterMetaByAliasName(name: string) {
        if (this.routerMeta) {
            return this.routerMeta.filter(item => item.aliasName === name)[0];
        } else {
            throw new Error('未配置routes, 请在初始化的时候配置')
        }
    }

    /**
     * 获取meta信息 by 系统路由地址
     * @param route
     * @protected
     */
    protected getRouterMetaBySysRoute(route: string) {
        route = completionPathWithAbsolute(route);
        return this.getRouterMetaByRoute(route);
    }

}
