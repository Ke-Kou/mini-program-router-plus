import {navigatorCall2Promise} from "./utils/tools";
import {PageType} from "./metaData";
import {RoutesConfig} from "./router";
import {logInfo} from "./utils/logger";
import {combineRouteWithQuery, getRouterRoute, getSysPageRouters, pathEquals} from "./utils/router";
import RouterStackBus, {Emit} from "./routerStackBus";

export interface NavigatorParams  {
    url: RoutesConfig['route'],
    delta?: number;
    success?: Function;
    fail?: Function;
    complete?: Function;
    query?: Record<string, string|number>; // 携带在链接上的参数
    params?: Record<string, any>; // 存放在内存中的参数
    events?: Emit;
}

export type MiniNavigatorMethod = (navigatorParams: NavigatorParams) => void;

export interface MiniNavigator {
    switchTab: MiniNavigatorMethod;
    reLaunch: MiniNavigatorMethod;
    redirectTo: MiniNavigatorMethod;
    navigateTo: MiniNavigatorMethod;
    navigateBack: MiniNavigatorMethod;
}

export interface SelfRouterStackItem {
    route: string;
    params?: Record<string, any>;
    query?: Record<string, any>;
}

// @ts-ignore
const defaultLinkAction = (navigatorParams: NavigatorParams) => logInfo('you did not set navigator yet!')

const defaultNavigator: MiniNavigator = {
    switchTab: defaultLinkAction,
    reLaunch: defaultLinkAction,
    redirectTo: defaultLinkAction,
    navigateTo: defaultLinkAction,
    navigateBack: defaultLinkAction,
}

/**
 * 路由控制层
 */
export default class Navigator extends RouterStackBus {
    protected controller: MiniNavigator = defaultNavigator;
    protected maxStack: number = 10;

    protected setNavigatorController(controller: MiniNavigator) {
        this.controller = controller;
    }

    protected setMaxStack(num: number) {
        this.maxStack = num;
    }

    protected _goto(config: NavigatorParams, replaceMode: boolean): Promise<any> {
        const router = this.getRouterMetaByRoute(config.url);
        const currentRouterStack = getSysPageRouters();
        const stackLen = currentRouterStack.length;
        if (stackLen >= this.maxStack) {
            for (let i = stackLen - 1; i >= 0; i--) {
                const route = getRouterRoute(currentRouterStack[i]);
                if (pathEquals(route, config.url)) {
                    return this._navigateBack({
                        delta: stackLen - 1 - i,
                        ...config
                    })
                }
            }
            return this._redirectTo(config);
        } else {
           if (router.pageType === PageType.tab) {
               return this._switchTab(config)
           } else {
               if (replaceMode) {
                   return this._redirectTo(config)
               } else {
                   return this._navigateTo(config)
               }
           }
        }
    }

    protected _switchTab(config: NavigatorParams): Promise<any> {
        const newConfig = {
            ...config,
            url: combineRouteWithQuery(config.url, config.query || {}),
        }

        this.clearRouterStack();
        this.addTabRouterStacks({
            route: config.url,
            events: config.events,
            params: config.params,
            query: config.query,
        });

        return navigatorCall2Promise(this.controller.switchTab)(newConfig).then(res => {
            return res;
        }, reason => reason).catch(err => {
            throw err;
        });
    }

    protected _reLaunch(config: NavigatorParams): Promise<any> {
        const temp = {
            route: config.url,
            events: config.events,
            params: config.params,
            query: config.query,
        }
        const newConfig = {
            ...config,
            url: combineRouteWithQuery(config.url, config.query || {}),
        }

        this.stackSnapShotSave();

        const routerMeta = this.getRouterMetaByRoute(config.url);
        this.clearRouterStack();
        this.clearTabRouterStack();
        if (routerMeta.pageType === PageType.tab) {
            this.addTabRouterStacks(temp)
        } else {
            this.addRouterStack(temp);
        }

        return navigatorCall2Promise(this.controller.reLaunch)(newConfig).then(() => {
            this.stackSnapShotRelease()
        }).catch(() => {
            this.stackSnapShotReply()
        });
    }

    protected _redirectTo(config: NavigatorParams): Promise<any> {
        const newConfig = {
            ...config,
            url: combineRouteWithQuery(config.url, config.query || {}),
        }

        this.stackSnapShotSave();

        this.alignStack({sign: '_redirectTo'});
        this.popRouterStack();
        this.addRouterStack({
            route: config.url,
            events: config.events,
            params: config.params,
            query: config.query,
        });
        return navigatorCall2Promise(this.controller.redirectTo)(newConfig).then((res) => {
            this.stackSnapShotRelease();
            return res;
        }, reason => reason).catch(err => {
            this.stackSnapShotReply();
            throw err;
        });
    }

    protected _navigateTo(config: NavigatorParams): Promise<any> {
        const newConfig = {
            ...config,
            url: combineRouteWithQuery(config.url, config.query || {}),
        }
        this.alignStack({sign: '_navigateTo'});
        this.addRouterStack({
            route: config.url,
            events: config.events,
            params: config.params,
            query: config.query,
        });
        return navigatorCall2Promise(this.controller.navigateTo)(newConfig).then((res) => {
            return res;
        }, reason => reason).catch(err => {
            this.popRouterStack();
            throw err;
        });
    }

    protected _navigateBack(config: NavigatorParams): Promise<any> {
        this.stackSnapShotSave();
        this.alignStack({sign: '_navigateBack'});
        this.popRouterStack(config.delta);
        return navigatorCall2Promise(this.controller.navigateBack)(config).then((res) => {
            this.stackSnapShotRelease();
            return res;
        }, reason => reason).catch(err => {
            this.stackSnapShotReply();
            throw err;
        });
    }
}
