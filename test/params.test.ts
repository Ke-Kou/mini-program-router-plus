import { initRouter } from '../lib/index';
import navigator from "./stubs/navigator";
import Router from "../lib/router";

describe('路由传参测试', function () {
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

    it('tab2normal传递query参数', function () {
        const options = {
            query: {
                name: 'jooker'
            },
            params: {
                age: 12,
                hobby: ['switch', 'fitness']
            }
        }
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()})
        return router.goto('/pages/logs/logs', options).then(() => {
            global.getCurrentPages = () => [
                {
                    route: 'pages/user/user'
                },
                {
                    route: 'pages/logs/logs'
                }
            ];
            const currentParams = router.getCurrentInstanceParams();
            expect(currentParams).toEqual(options)
        })
    });
    it('tab2tab传递参数', function () {
        const options = {
            query: {
                name: 'jooker'
            },
            params: {
                age: 12,
                hobby: ['switch', 'fitness']
            }
        }
        spy = jest.spyOn(navigator, 'switchTab');
        spy.mockImplementation((options) => {options.success()})

        return router.goto('/pages/home/home', options).then(() => {
            global.getCurrentPages = () => [
                {
                    route: 'pages/home/home'
                }
            ];
            const currentParams = router.getCurrentInstanceParams();
            expect(currentParams).toEqual(options)
        })
    });
});
