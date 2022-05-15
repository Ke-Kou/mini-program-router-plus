import Router, {RouterConfig} from "./router";

let instanceRouter;

export const getCurrentInstanceParams = () => instanceRouter.getCurrentInstanceParams();
export const initRouter = (config: RouterConfig) => {
    instanceRouter = new Router(config);
    instanceRouter.initStack();

    // Do not use the following api for now
    instanceRouter.push = instanceRouter.navigateTo;
    instanceRouter.pop = instanceRouter.navigateBack;
    instanceRouter.to = instanceRouter.goto;
    instanceRouter.replace = instanceRouter.redirectTo;
    return instanceRouter
}
