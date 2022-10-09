import Router, {RouterConfig} from "./router";

let instanceRouter: Router;

export function getCurrentInstanceParams<T>() {
    if (instanceRouter) {
        return instanceRouter.getCurrentInstanceParams<T>();
    } else {
        throw new Error('you need initRouter before use getCurrentInstanceParams');
    }
}

export const initRouter = (config: RouterConfig) => {
    instanceRouter = new Router(config);
    instanceRouter.initStack();
    return instanceRouter
}
