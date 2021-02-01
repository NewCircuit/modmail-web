import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserState } from '../state';

type Props = {
    setReady: () => void;
    children: JSX.Element;
};

function Authenticator(props: Props) {
    const { children, setReady } = props;
    const { authenticated, processing, authenticate } = UserState.useContainer();
    const history = useHistory();

    useEffect(() => {
        console.log({ authenticated, processing });
        if (!processing) {
            if (typeof authenticated === 'undefined') {
                console.log('authenticate');
                authenticate();
            } else {
                if (setReady) setReady();
                if (!authenticated) {
                    history.push('/unauthorized');
                }
            }
        }
    }, [authenticated, processing]);
    if (typeof authenticated === 'undefined') return <div />;
    return children;
}

export type AuthenticatorProps = Props;
export default Authenticator;
