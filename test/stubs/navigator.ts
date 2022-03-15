
export const navigateToMockFun = jest.fn();
export const redirectToMockFun = jest.fn();
export const navigateBackMockFun = jest.fn();
export const switchTabMockFun = jest.fn();
export const reLaunchMockFun = jest.fn();
export const getCurrentPagesMockFun = jest.fn(() => ([{
    route: 'pages/home/home'
}]));

export default {
    navigateTo: navigateToMockFun,
    redirectTo: redirectToMockFun,
    navigateBack: navigateBackMockFun,
    switchTab: switchTabMockFun,
    reLaunch: reLaunchMockFun,
    // getCurrentInstance: () => {
    //     router: {}
    // },
    getCurrentPages: getCurrentPagesMockFun
}
