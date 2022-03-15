export function isFun(data: unknown) {
    return typeof data === 'function'
}

export function isUndef(data: unknown) {
    return data === null || data === undefined;
}
