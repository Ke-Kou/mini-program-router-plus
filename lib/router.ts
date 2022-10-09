import {NavigatorParams} from "./navigator";
import Guider, {BeforeEachHandle, AfterEachHandle} from "./guider";
import {completionPathWithAbsolute, getCurrentPageRoute, getSysPageRoute, getSysPageRouters} from "./utils/router";
import {logDetail, logError, logGroupEnd, logGroupStart, openDebuggeMode} from "./utils/logger";
import {PageType} from "./metaData";
import {RouterStackItem} from "./routerStackBus";

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
    debugger?: boolean; // 开启debugger模式
}


/**
 * 路由层
 */
export default class Router extends Guider{

    constructor(config: RouterConfig) {
        super();
        this.setConfig(config);
    }

    private getRoutePath(name: string) {
        if (name.match(/^\//)) {
            return name;
        } else {
            const meta = this.getRouterMetaByAliasName(name);
            if (meta) {
                return meta.route;
            } else {
                throw new Error('请检查routes配置别名');
            }
        }
    }

    /**
     * 该方法只能在首次初始化的时候被调用
     * 用于第一次同步系统路由栈到自定义路由栈中
     * @private
     */
    initStack() {
        const sysFirstRouterStack = getSysPageRouters()[0];
        if (sysFirstRouterStack) {
            const {stack, meta} = this.createNewStackFromSysRouterStack(sysFirstRouterStack);
            if (meta.pageType === PageType.normal) {
                this.addRouterStack(stack)
            } else {
                this.addTabRouterStacks({...stack, activated: true})
            }
        } else {
            setTimeout(() => {
                if (!(this.getStack() || this.getTabStack())) {
                    this.initStack()
                }
            }, 200);
        }
    }

    setConfig(config: RouterConfig) {
        config.navigator && this.setNavigatorController(config.navigator)
        config.routes && this.initMetaData(config.routes);
        config.maxStack && this.setMaxStack(config.maxStack);
        config.debugger && openDebuggeMode();
    }

    goto(route: string,  option?: Partial<NavigatorParams>) {
        route = this.getRoutePath(route);
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
        route = this.getRoutePath(route);
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
        route = this.getRoutePath(route);
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
        route = this.getRoutePath(route);
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
        route = this.getRoutePath(route);
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

    navigateBack(option?: Partial<NavigatorParams>): Promise<any> {
        const lastSysRoute = completionPathWithAbsolute(getSysPageRoute(-2));
        const currentPageRoute = getCurrentPageRoute();
        return this.checkGuardsBefore(lastSysRoute).then(
            () => {
                const {url, ...rest} = option || {};
                return this._navigateBack({url: url || lastSysRoute, ...rest});
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

    getCurrentInstanceParams<T>() {
        logGroupStart('获取当前路由参数')
        const stack = this.getCurrentStack() as RouterStackItem<T>;
        logDetail('获取当前路由', [
            '当前路由',
            stack
        ])
        logGroupEnd();
        return {
            query: stack.query,
            params: stack.params
        }
    }

    getCurrentPage() {
        return this.getCurrentStack();
    }
}
