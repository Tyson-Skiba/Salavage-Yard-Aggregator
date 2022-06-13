export const ConfigureWithTimeout = <T extends any>(promise: Promise<T>, timeout: number): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);

        promise
            .then(value => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
    });
}
