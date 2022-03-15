import Router, {RouterConfig} from "./router";

let instanceRouter;

export const getCurrentInstanceParams = () => instanceRouter.getCurrentInstanceParams();
export const initRouter = (config: RouterConfig) => instanceRouter = new Router(config);
