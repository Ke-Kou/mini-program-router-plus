let debuggerMode = false;

export function logInfo(mes: string) {
    console.log(mes);
}

export function logError(mes: string, show: boolean = true) {
    if (show) {
       throw new Error(mes);
    }
}

export function logDetail(name: string, mes?: any[]) {
    if (!debuggerMode) return;
    logGroupStart(name);
    if (mes) {
        for (let i = 0; i < mes.length; i +=2) {
            console.log(mes[i], mes[i + 1])
        }
    }
    logGroupEnd();
}

export function logGroupStart(name: string) {
    if (!debuggerMode) return;
    console.group(name);
}

export function logGroupEnd(_name?: string) {
    if (!debuggerMode) return;
    console.groupEnd();
}

export function openDebuggeMode() {
    debuggerMode = true;
}

export function closeDebuggMode() {
    debuggerMode = false;
}
