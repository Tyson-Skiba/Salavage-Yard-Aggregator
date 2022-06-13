type Executor<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

export class PromiseEx<T> extends Promise<T> {
    constructor(executor: Executor<T>, timeout?: number) {
        super((resolve, reject) => {
            if (!!timeout) {
                const timer = setTimeout(() => {
                    reject(new Error(`Promise timed out after ${timeout}ms`));
                }, timeout);

                executor(
                    (value) => {
                        clearTimeout(timer);
                        resolve(value);
                    },
                    (error) => {
                        clearTimeout(timer);
                        reject(error);
                    }
                );
            } else {
                executor(resolve, reject);
            }
        });
    }
}