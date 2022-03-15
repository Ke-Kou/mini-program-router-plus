import {NavigatorParams} from "./navigator";
import Guider, {BeforeEachHandle, AfterEachHandle} from "./guider";
import {getCurrentPageRoute} from "./utils/router";
import {logError} from "./utils/logger";

export interface RoutesConfig {
    route: string; // 路径,必须是/pages/index/index形式
    name?: string; // todo 用于后面通过name指定方式跳转
    beforeEnter?: BeforeEachHandle;
    isTab?: boolean; // 是否是tab页
}

export interface RouterConfig {
    navigator: any; // 原生跳转控制器
    routes: RoutesConfig[],// 路径配置
    maxStack?: number; // 最大路由栈
    beforeEach?: BeforeEachHandle // 路由前置钩子
    afterEach?: AfterEachHandle // 路由后置钩子
}


/**
 * 路由层
 */
export default class Router extends Guider{

    constructor(config: RouterConfig) {
        super();
        this.setConfig(config);
    }

    setConfig(config: RouterConfig) {
        config.navigator && this.setNavigatorController(config.navigator)
        config.routes && this.initMetaData(config.routes);
        config.maxStack && this.setMaxStack(config.maxStack);

    }

    goto(route: string,  option?: Partial<NavigatorParams>) {
        // todo 检查route是否是绝对路径
        const currentPageRoute = getCurrentPageRoute();
        return this.checkGuardsBefore(route).then(
            () => {
                const {url, ...rest} = option || {};
                return this._goto({url: url || route, ...rest});
            },
            res => {
                return res
            }
        )
            .then(() => this.checkGuardsAfter(currentPageRoute))
            .catch((err) => {logError(err)})
    }

    switchTab(route: string,  option?: Partial<NavigatorParams>) {
        const currentPageRoute = getCurrentPageRoute();
        return this.checkGuardsBefore(route).then(
            () => {
                const {url, ...rest} = option || {};
                return this._switchTab({url: url || route, ...rest});
            },
            res => {
                return res
            }
        )
            .then(() => this.checkGuardsAfter(currentPageRoute))
            .catch((err) => {logError(err)})
    }

    reLaunch(route: string,  option?: Partial<NavigatorParams>) {
        const currentPageRoute = getCurrentPageRoute();
        return this.checkGuardsBefore(route).then(
            () => {
                const {url, ...rest} = option || {};
                return this._reLaunch({url: url || route, ...rest});
            },
            res => {
                return res
            }
        )
            .then(() => this.checkGuardsAfter(currentPageRoute))
            .catch((err) => {logError(err)})
    }

    redirectTo(route: string,  option?: Partial<NavigatorParams>) {
        const currentPageRoute = getCurrentPageRoute();
        return this.checkGuardsBefore(route).then(
            () => {
                const {url, ...rest} = option || {};
                return this._redirectTo({url: url || route, ...rest});
            },
            res => {
                return res
            }
        )
            .then(() => this.checkGuardsAfter(currentPageRoute))
            .catch((err) => {logError(err)})
    }

    navigateTo(route: string,  option?: Partial<NavigatorParams>) {
        const currentPageRoute = getCurrentPageRoute();
        return this.checkGuardsBefore(route).then(
            () => {
                const {url, ...rest} = option || {};
                return this._navigateTo({url: url || route, ...rest});
            },
            res => {
                return res
            }
        )
            .then(() => this.checkGuardsAfter(currentPageRoute))
            .catch((err) => {logError(err)})
    }

    navigateBack(route: string,  option?: Partial<NavigatorParams>): Promise<any> {
        const currentPageRoute = getCurrentPageRoute();
        return this.checkGuardsBefore(route).then(
            () => {
                const {url, ...rest} = option || {};
                return this._navigateBack({url: url || route, ...rest});
            },
            res => {
                return res
            }
        )
            .then(() => this.checkGuardsAfter(currentPageRoute))
            .catch((err) => {logError(err)})
    }

    beforEach(handle: BeforeEachHandle) {
        this.setBeforeEach(handle)
    }

    afterEach(handle: AfterEachHandle) {
        this.setAfterEach(handle)
    }

    emit(eventName: string, params: any): Promise<unknown> {
        return this.runEvent(eventName, params)
    }

    getCurrentInstanceParams() {
        const {query, params} = this.getCurrentStack();
        return {
            query,
            params
        }
    }

    getCurrentPage() {
        return this.getCurrentStack();
    }
}
