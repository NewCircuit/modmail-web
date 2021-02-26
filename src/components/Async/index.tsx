import { useEffect, useState } from 'react';
import { Logger } from '../../util';

const logger = Logger.getLogger('c/Async');

type Props<T> = {
    promise: Promise<T> | null;
    onReject?: any;
    children: (promiseValue: T) => JSX.Element;
};

function Async(props: Props<any>) {
    const { children, promise } = props;
    const [handledPromise, setHandledPromise] = useState(null);
    useEffect(() => {
        if (promise) {
            promise
                .then((response) => {
                    setHandledPromise(response);
                })
                .catch((err) => {
                    logger.fatal(err);
                });
        }
    }, [promise]);
    return children(handledPromise);
}

export type AsyncProps<T> = Props<T>;
export default Async;
