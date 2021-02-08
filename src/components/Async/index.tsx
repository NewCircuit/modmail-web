import { useEffect, useState } from 'react';

type Props<T> = {
    promise: Promise<T> | null;
    children: (promiseValue: T) => JSX.Element;
};

function Async(props: Props<any>) {
    const { children, promise } = props;
    const [handledPromise, setHandledPromise] = useState(null);
    useEffect(() => {
        if (promise) {
            promise.then((response) => {
                setHandledPromise(response);
            });
        }
    }, [promise]);
    return children(handledPromise);
}

export type AsyncProps<T> = Props<T>;
export default Async;
