import { initRouter } from '../lib/index';
import navigator from "./stubs/navigator";
import Router from "../lib/router";

describe('路由守卫测试', function () {
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
        router = null;
        spy && spy.mockClear();
        global.getCurrentPages = null;
    })
    it('路由跳转测试', function () {
        let _to, _from;
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()});

        router.beforeEach((to, from, next) => {
            _to = to;
            _from = from;
            next();
        })
        return router.goto('/pages/logs/logs').then(() => {
            expect(_to).toBe('/pages/logs/logs');
            expect(_from).toBe('/pages/user/user');
            expect(spy).toHaveBeenCalled();
        })
    });
    it('路由拦截测试', function () {
        let _to, _from;
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()});

        router.beforeEach((to, from, next) => {
            _to = to;
            _from = from;
            next(false);
        })
        return router.goto('/pages/logs/logs').then(() => {
            expect(_to).toBe('/pages/logs/logs');
            expect(_from).toBe('/pages/user/user');
            expect(spy).not.toHaveBeenCalled();
        })
    });
    it('路由拦截跳转', function () {
        let _to, _from;
        spy = jest.spyOn(navigator, 'switchTab');
        spy.mockImplementation((options) => {options.success()});
        const spy2 = jest.spyOn(navigator, 'navigateTo');
        spy2.mockImplementation((options) => {options.success()})
        router.beforeEach((to, from, next) => {
            _to = to;
            _from = from;
            next('/pages/home/home');
        })
        return router.goto('/pages/logs/logs').then(() => {
            global.getCurrentPages = () => [
                {
                    route: 'pages/home/home'
                }
            ];
            const currentPage = router.getCurrentPage();
            expect(currentPage.route).toBe('/pages/home/home')
            expect(_to).toBe('/pages/logs/logs');
            expect(_from).toBe('/pages/user/user');
            expect(spy).toHaveBeenCalled();
            expect(spy2).not.toHaveBeenCalled();
        })
    });
});
