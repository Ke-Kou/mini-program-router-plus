import {isUndef, isFun} from "../lib/utils/isType";
import {parse, stringify} from "../lib/utils/tools";

describe('isType测试', function () {
    it('should be function', function () {
        expect(isFun(function () {})).toBeTruthy()
        expect(isFun(() => {})).toBeTruthy()
        expect(isFun({})).not.toBeTruthy()
    });
    it('should be undefined', function () {
        expect(isUndef(null)).toBeTruthy();
        expect(isUndef(undefined)).toBeTruthy();
        expect(isUndef(0)).not.toBeTruthy();
        expect(isUndef('')).not.toBeTruthy();
    });
});

describe('tools测试', function () {
    it('should be stringify & parse', function () {
        expect(stringify({name: 'jooker', age: 123})).toBe('name=jooker&age=123');
        expect(stringify({name: 'jooker', hobbies: ['switch', 'fitness']})).toBe('name=jooker&hobbies%5B0%5D=switch&hobbies%5B1%5D=fitness');
        expect(parse('name=jooker&age=123')).toEqual({name: 'jooker', age: '123'})
    });
});
