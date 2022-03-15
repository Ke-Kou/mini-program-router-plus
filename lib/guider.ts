import {getCurrentPageRoute} from "./utils/router";
import {isFun} from "./utils/isType";
import {logError, logInfo} from "./utils/logger";
import Navigator from "./navigator";

export type BeforeEachHandle = ((to: string, from: string, next, router?) => void) | null;
export type AfterEachHandle = ((to: string, from: string, router?) => void) | null;

/**
 * 拦截层
 * 检查抹平数据路由
 */
export default class Guider extends Navigator {
    protected globalBeforeEach: BeforeEachHandle;
    protected globalAfterEach: AfterEachHandle;

    /**
     * 设置全局前置钩子
     * @param handle
     * @protected
     */
    protected setBeforeEach(handle: BeforeEachHandle) {
        this.globalBeforeEach = handle;
    }

    /**
     * 设置全局后置钩子
     * @param handle
     * @protected
     */
    protected setAfterEach(handle: AfterEachHandle) {
        this.globalAfterEach = handle;
    }

    /**
     * 前置路由守卫检查
     * @param nextPageRoute
     * @protected
     */
    protected checkGuardsBefore(nextPageRoute: string): Promise<string> {
        const currentPageRoute = getCurrentPageRoute();

        const currentRouter = this.getRouterMetaBySysRoute(currentPageRoute);
        const nextRouter = this.getRouterMetaByRoute(nextPageRoute);
        logError(`没有找到对应的路由配置信息,请检查是否配置${nextPageRoute}`, !nextRouter);
        const selfBeforeEnter = nextRouter.beforeEnter;

        const nextMaker = (resolve, reject) => (sign?: boolean | string,
                                                options?: any) => {
            if (sign === false) {
                logInfo(`路由被拦截, 页面: ${nextPageRoute}`);
                reject();
            } else if (typeof sign === 'string') {
                logInfo(`跳转到页面: ${sign}`)
                this._goto({url: sign, ...options}).then(() => reject())
            } else {
                resolve();
            }
        }

        const globalCheckPromiseHandle: () => Promise<string> = () =>  new Promise((resolve, reject) => {
            const next = nextMaker(resolve, reject);

            if (isFun(this.globalBeforeEach)) {
                this.globalBeforeEach!(nextPageRoute, currentRouter.route, next, currentRouter);
            } else {
                next();
            }
        });

        if (nextRouter && isFun(selfBeforeEnter)) {
            return new Promise((resolve, reject) => {
                const next = nextMaker(resolve, reject);
                return globalCheckPromiseHandle().then(() =>
                    selfBeforeEnter!(nextRouter.route, currentRouter.route, next)
                );
            })
        } else {
            return globalCheckPromiseHandle();
        }
    }

    /**
     * 后置路由检查
     * @param fromRoute
     * @protected
     */
    protected checkGuardsAfter(fromRoute: string) {
        if (this.globalAfterEach) {
            // todo 待增加自身后置钩子
            const currentPageRoute = getCurrentPageRoute();
            const currentRouter = this.getRouterMetaByRoute(currentPageRoute);
            this.globalAfterEach(currentPageRoute, fromRoute, currentRouter);
        }
    }
}
