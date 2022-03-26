import { initRouter } from '../lib/index';
import navigator from "./stubs/navigator";
import Router from "../lib/router";

describe('路径跳转测试', function () {
    let spy;
    let router: Router;

    beforeEach(() => {
        // jest.setTimeout(20000);
        global.getCurrentPages = () => [
            {
                route: 'pages/user/user'
            }
        ];
        router = initRouter({
            navigator,
            routes: [
                {
                    route: '/pages/user/user',
                    isTab: true,
                },
                {
                    route: '/pages/home/home',
                    isTab: true,
                },
                {
                    route: '/pages/logs/logs',
                }
            ]
        });
    })

    afterEach(() => {
        spy && spy.mockClear();
        global.getCurrentPages = null;
    })
    it('navigateTo测试', function () {
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()})
        return router.navigateTo('/pages/logs/logs').then(() => {
            expect(navigator.navigateTo).toHaveBeenCalled();
        })
    });
    it('switchTab测试', function () {
        spy = jest.spyOn(navigator, 'switchTab');
        spy.mockImplementation((options) => {options.success()})
        return router.switchTab('/pages/home/home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('reLaunch测试', function () {
        spy = jest.spyOn(navigator, 'reLaunch');
        spy.mockImplementation((options) => {options.success()})
        return router.reLaunch('/pages/home/home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('redirectTo测试', function () {
        spy = jest.spyOn(navigator, 'redirectTo');
        spy.mockImplementation((options) => {options.success()})
        return router.redirectTo('/pages/home/home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('navigateBack测试', function () {
        spy = jest.spyOn(navigator, 'navigateBack');
        spy.mockImplementation((options) => {options.success()})
        return router.navigateBack('/pages/home/home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('goto测试-tab', function () {
        spy = jest.spyOn(navigator, 'switchTab');
        spy.mockImplementation((options) => {options.success()})
        return router.goto('/pages/home/home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('goto测试-normal', function () {
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()})
        return router.goto('/pages/logs/logs').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
});

describe('别名跳转测试', function () {
    let spy;
    let router: Router;

    beforeEach(() => {
        // jest.setTimeout(20000);
        global.getCurrentPages = () => [
            {
                route: 'pages/user/user'
            }
        ];
        router = initRouter({
            navigator,
            routes: [
                {
                    route: '/pages/user/user',
                    name: 'user',
                    isTab: true,
                },
                {
                    route: '/pages/home/home',
                    name: 'home',
                    isTab: true,
                },
                {
                    route: '/pages/logs/logs',
                    name: 'logs'
                }
            ]
        });
    })

    afterEach(() => {
        spy && spy.mockClear();
        global.getCurrentPages = null;
    })
    it('navigateTo测试', function () {
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()})
        return router.navigateTo('logs').then(() => {
            expect(navigator.navigateTo).toHaveBeenCalled();
        })
    });
    it('switchTab测试', function () {
        spy = jest.spyOn(navigator, 'switchTab');
        spy.mockImplementation((options) => {options.success()})
        return router.switchTab('home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('reLaunch测试', function () {
        spy = jest.spyOn(navigator, 'reLaunch');
        spy.mockImplementation((options) => {options.success()})
        return router.reLaunch('user').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('redirectTo测试', function () {
        spy = jest.spyOn(navigator, 'redirectTo');
        spy.mockImplementation((options) => {options.success()})
        return router.redirectTo('home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('navigateBack测试', function () {
        spy = jest.spyOn(navigator, 'navigateBack');
        spy.mockImplementation((options) => {options.success()})
        return router.navigateBack('home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('goto测试-tab', function () {
        spy = jest.spyOn(navigator, 'switchTab');
        spy.mockImplementation((options) => {options.success()})
        return router.goto('home').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('goto测试-normal', function () {
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()})
        return router.goto('logs').then(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
});
