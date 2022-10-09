import {getRouterRoute, getSysPageRouters, SysMiniRouter} from "./utils/router";
import MetaData, {PageType, RouterMetaType} from "./metaData";
import {logDetail, logGroupEnd, logGroupStart, logInfo} from "./utils/logger";

export type EventName = string;

export type Emit = {
    [name: EventName]: EmitFun;
};

export type NextBCallback = (param?: unknown) => void

export type EmitFun = (data: unknown, next: NextBCallback) => void;

export type URLParams<T> = Record<string, T>;

export type URLQuery<T> = Record<string, T>;

export interface RouterStackItem<T = any> {
    route: string;
    events?: Emit;
    params?: URLParams<T> | T;
    query?: URLQuery<T> | T;
}

export interface TabRouterStackItem extends RouterStackItem{
    activated?: boolean;
}

export interface CreateNewStackFromSysResult {
    stack: RouterStackItem,
    meta: RouterMetaType,
}

let stacksSnapShot: RouterStackItem[] | null = null;
let tabSatckSnapShot: TabRouterStackItem[] | null = null;

/**
 * 路由栈数据层
 */
export default class RouterStackBus extends MetaData{
    private stacks: RouterStackItem[] = []; // 普通栈
    private tabStacks: TabRouterStackItem[] = []; // tab栈 tab栈存在时一定是栈底

    /**
     * 添加普通栈
     * @param item
     * @protected
     */
    protected addRouterStack(item: RouterStackItem) {
        logDetail('增加普通库栈', [
            'stack',
            item
        ])
        this.stacks.push(item);
    }

    protected addTabRouterStacks(item: TabRouterStackItem) {
        logDetail('增加Tab库栈', [
            'tab-stack',
            item
        ])
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
        logDetail('清楚普通库栈', [
            '清除之前stack',
            JSON.stringify(this.stacks)
        ])
        this.stacks = [];
    }

    protected clearTabRouterStack() {
        logDetail('清楚Tab库栈', [
            '清除之前stack',
            JSON.stringify(this.tabStacks)
        ])
        this.tabStacks = [];
    }

    /**
     * 抹平系统stack和自定义stack之间的区别
     */
    protected alignStack({sign}) {
        logGroupStart(`开始抹平stack, 标识:${sign}`)
        const sysRouterStack = getSysPageRouters();
        const {stack: sys2Stack} = this.createNewStackFromSysRouterStack(sysRouterStack[0])
        const routeMeta = this.getRouterMetaBySysRoute(getRouterRoute(sysRouterStack[0]));
        logDetail('抹平前相关数据', [
            '系统栈: ',
            sysRouterStack,
            '普通库栈: ',
            JSON.stringify(this.stacks),
            'tab库栈: ',
            JSON.stringify(this.tabStacks)
        ])

        if (sysRouterStack.length === 1) {
            logGroupStart('系统栈只有一个，执行清理')
            if (routeMeta.pageType === PageType.tab) {
                // 获取到之前存在的tab
                const tabStack = this.tabStacks.filter(stack => stack.route === routeMeta.route)[0];
                this.clearRouterStack();
                this.clearTabRouterStack();
                this.addTabRouterStacks(tabStack || sys2Stack)
                logDetail('系统栈只有一个tab, 将系统tab插入到库栈', [
                    '插入的tab栈',
                    tabStack || sys2Stack
                ] );
            } else {
                this.stacks = this.stacks[0] && this.stacks[0].route === routeMeta.route ? [this.stacks[0]] : [sys2Stack]
                logDetail('系统栈只有一个普通路由, 插入到库栈', [
                    '插入的普通栈',
                    JSON.stringify(this.stacks),
                    '当前库栈',
                    this.stacks
                ] );
            }
            logGroupEnd('系统栈只有一个，执行清理');
        } else {
            logGroupStart('系统栈有多个，执行清理')
            const diff = this.stacks.length - (sysRouterStack.length - (routeMeta.pageType == PageType.tab ? 1 : 0))
            if (diff > 0) {
                logDetail('库栈数量大于系统栈,执行弹出操作', [
                    '超出的数量: ',
                    diff,
                    '当前库栈',
                    JSON.stringify(this.stacks)
                ])
                this.popRouterStack(diff);
            } else if (diff < 0) {
                logDetail('库栈数量小于系统栈', [
                    '小于数量：',
                    diff,
                    '当前库栈',
                    this.stacks,
                    '当前系统栈',
                    sysRouterStack
                ])
            }
            logGroupEnd('系统栈有多个，执行清理')
        }
        logGroupEnd()
    }

    protected popRouterStack(num: number = 1) {
        logDetail('执行弹出操作', [
            '弹出数量: ',
            num,
        ])
        const leaveStack: RouterStackItem[] = [];
        while (num) {
            const stack = this.stacks.pop();
            stack && leaveStack.push(stack);
            num--;
        }
        return leaveStack
    }

    // 栈快照 - 保存
    protected stackSnapShotSave() {
        stacksSnapShot = this.stacks.slice();
        tabSatckSnapShot = this.tabStacks.slice();
    }

    // 栈快照 - 恢复
    protected stackSnapShotReply() {
        if (stacksSnapShot) {
            this.stacks = stacksSnapShot;
        }

        if (tabSatckSnapShot) {
            this.tabStacks = tabSatckSnapShot;
        }

    }

    // 栈快照 - 释放
    protected stackSnapShotRelease() {
        stacksSnapShot = null;
        tabSatckSnapShot = null;
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
        this.alignStack({sign: 'getCurrentStack'});
        return this.stacks.length ?
            this.stacks[this.stacks.length - 1] :
            this.tabStacks.filter(stack => stack.activated)[0]
    }

    protected runEvent(name: EventName, params: any) {
        logDetail('执行Event事件之前', [
            '事件名: ',
            name,
            '事件参数: ',
            params
        ])
        this.alignStack({sign: 'runEvent'});
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

            logDetail('执行Event事件', [
                '是否存在事件',
                !!event,
            ])

            if (event) {
                logInfo(`执行${name}事件监听`);
                event(params, next);
            }
        })
    }

    public getStack() {
        return this.stacks;
    }

    public getTabStack() {
        return this.tabStacks;
    }
}
