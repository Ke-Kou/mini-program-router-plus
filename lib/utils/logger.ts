
export function logInfo(mes: string) {
    console.log(mes);
}

export function logError(mes: string, show: boolean = true) {
    if (show) {
       console.error(mes)
    }
}
