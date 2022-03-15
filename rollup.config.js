const typescript = require('rollup-plugin-typescript2');
import commonjs from 'rollup-plugin-commonjs';
const path = require('path');

function resolveOutput() {
    return path.resolve(__dirname, 'dist', 'index.js')
}

function resolveInput() {
    return path.resolve(__dirname, 'lib', 'index.ts')
}

export default {
    input: resolveInput(),
    output: {
        file: resolveOutput(),
        format: 'cjs' // 导出es6模式, 由taro去转格式
    },
    plugins: [
        typescript({
            cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
        }),
        commonjs({
            include: /node_modules/
        })
    ],
    external: ['@tarojs/taro']
}
