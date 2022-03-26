import { initRouter } from '../lib/index';
import navigator from "./stubs/navigator";
import Router from "../lib/router";

describe('A/B事件处理', function () {
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

    it('tab <-> nomral通信测试', function (done) {
        const emitFn = jest.fn();
        spy = jest.spyOn(navigator, 'navigateTo');
        spy.mockImplementation((options) => {options.success()});
        let callBackResultTab;
        let callBackResultNormal;
        return router.goto('/pages/logs/logs', {
            events: {
                ok: (res, next) => {
                    emitFn();
                    callBackResultTab = res;
                    next(456);
                }
            }
        }).then(() => {
            global.getCurrentPages = () => [
                {
                    route: 'pages/user/user'
                },
                {
                    route: 'pages/logs/logs'
                }
            ];
            router.emit('ok', 123).then(
                (res) => {
                    callBackResultNormal = res;
                    expect(callBackResultNormal).toEqual(456);
                    done()
                }
            )
            expect(emitFn).toBeCalled();
            expect(callBackResultTab).toBe(123);
        })
    });
    it('tab <-> tab通信测试', function (done) {
        const emitFn = jest.fn();
        spy = jest.spyOn(navigator, 'switchTab');
        spy.mockImplementation((options) => {options.success()});
        let callBackResultA;
        let callBackResultB;
        return router.goto('/pages/home/home', {
            events: {
                ok: (res, next) => {
                    emitFn();
                    callBackResultA = res;
                    next(456);
                }
            }
        }).then(() => {
            global.getCurrentPages = () => [
                {
                    route: 'pages/home/home'
                },
            ];
            router.emit('ok', 123).then(
                (res) => {
                    callBackResultB = res;
                    expect(callBackResultB).toEqual(456);
                    done()
                }
            )
            expect(emitFn).toBeCalled();
            expect(callBackResultA).toBe(123);
        })
    });
})
