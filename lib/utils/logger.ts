
export function logInfo(mes: string) {
    console.log(mes);
}

export function logError(mes: string, show: boolean = true) {
    if (show) {
       throw new Error(mes);
    }
}
