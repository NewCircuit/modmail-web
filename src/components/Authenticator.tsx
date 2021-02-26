import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UserState } from '../state';

type Props = {
    setReady: () => void;
    children: JSX.Element;
};

function Authenticator(props: Props) {
    const { children, setReady } = props;
    const { authenticated, processing, authenticate } = UserState.useContainer();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (!processing) {
            if (typeof authenticated === 'undefined') {
                authenticate();
            } else {
                if (setReady) setReady();
                if (!authenticated && location.pathname.indexOf('/unauthorized') === -1) {
                    let search = '';
                    if (location.pathname !== '/') {
                        search = `?r=${location.pathname}`;
                    }
                    history.push(`/unauthorized${search}`);
                }
            }
        }
    }, [authenticated, processing]);
    if (typeof authenticated === 'undefined') return <div />;
    return children;
}

export type AuthenticatorProps = Props;
export default Authenticator;
