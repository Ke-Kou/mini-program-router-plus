import {getRouterRoute, getSysPageRouters, SysMiniRouter} from "./utils/router";
import MetaData, {PageType, RouterMetaType} from "./metaData";
import {logInfo} from "./utils/logger";

export type EventName = string;

export type Emit = {
    [name: EventName]: EmitFun;
};

export type NextBCallback = (param: unknown) => void

export type EmitFun = (data: unknown, next: NextBCallback) => void;

export type URLParams = Record<string, unknown>;

export type URLQuery = Record<string, unknown>;

export interface RouterStackItem {
    route: string;
    events?: Emit;
    params?: URLParams;
    query?: URLQuery;
}

export interface TabRouterStackItem extends RouterStackItem{
    activated?: boolean;
}

export interface CreateNewStackFromSysResult {
    stack: RouterStackItem,
    meta: RouterMetaType,
}

/**
 * 路由栈数据层
 */
export default class RouterStackBus extends MetaData{
    private stacks: RouterStackItem[] = [];
    private tabStacks: TabRouterStackItem[] = []; // tabStack一定是栈底

    protected addRouterStack(item: RouterStackItem) {
        this.stacks.push(item);
    }

    protected addTabRouterStacks(item: TabRouterStackItem) {
        let tabStack;
        this.tabStacks.forEach(stack => {
            stack.activated = false;
            if (stack.route === item.route) {
                tabStack = stack;
            }
        })
        if (this.tabStacks.length === 0 || !tabStack) {
            item.activated = true;
            this.tabStacks.push(item)
        } else {
            tabStack.events = item.events;
            tabStack.params = item.params;
            tabStack.query = item.query;
            tabStack.activated = true;
        }
    }

    protected clearRouterStack() {
        this.stacks = [];
    }

    protected clearTabRouterStack() {
        this.tabStacks = [];
    }

    /**
     * 抹平系统stack和自定义stack之间的区别
     */
    protected alignStack() {
        const sysRouterStack = getSysPageRouters();
        const {stack: sys2Stack} = this.createNewStackFromSysRouterStack(sysRouterStack[0])
        const routeMeta = this.getRouterMetaBySysRoute(getRouterRoute(sysRouterStack[0]));

        if (sysRouterStack.length === 1) {
            if (routeMeta.pageType === PageType.tab) {
                // 获取到之前存在的tab
                const tabStack = this.tabStacks.filter(stack => stack.route === routeMeta.route)[0];
                this.clearRouterStack();
                this.clearTabRouterStack();
                this.addTabRouterStacks(tabStack || sys2Stack)
            } else {
                this.stacks = this.stacks[0] && this.stacks[0].route === routeMeta.route ? [this.stacks[0]] : [sys2Stack]
            }
        } else {
            const diff = this.stacks.length - (sysRouterStack.length - (routeMeta.pageType == PageType.tab ? 1 : 0))
            if (diff > 0) {
                this.popRouterStack(diff);
            } else if (diff < 0) {
                throw new Error('系统路由栈数量大于mini-router栈, 请向开发者提出issue')
            }
        }
    }

    protected popRouterStack(num: number = 1) {
        const leaveStack: RouterStackItem[] = [];
        while (num) {
            const stack = this.stacks.pop();
            stack && leaveStack.push(stack);
            num--;
        }
        return leaveStack
    }

    protected createNewStackFromSysRouterStack(router: SysMiniRouter): CreateNewStackFromSysResult {
        const routerMeta = this.getRouterMetaBySysRoute(getRouterRoute(router))
        return {
            stack: {
                route: routerMeta.route,
                query: router.options,
            },
            meta: routerMeta
        }
    }

    protected getCurrentStack() {
        this.alignStack();
        return this.stacks.length ?
            this.stacks[this.stacks.length - 1] :
            this.tabStacks.filter(stack => stack.activated)[0]
    }

    protected runEvent(name: EventName, params: any) {
        this.alignStack();
        return new Promise((resolve, reject) => {
            const next: NextBCallback = (res) => resolve(res);
            let event, currentStack;
            if (this.stacks.length) {
                currentStack = this.stacks[this.stacks.length - 1];
            } else if (this.tabStacks.length) {
                currentStack = this.tabStacks.filter(stack => stack.activated)[0];
            } else {
                reject('不存在执行事件对象')
            }

            event = currentStack.events ? currentStack.events[name] : null;
            if (event) {
                logInfo(`执行${name}事件监听`);
                event(params, next);
            }
        })
    }
}
