import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import Cookies from '../util/Cookies';

type State = FG.State.UserState;

function userState(): State {
    const [authenticated, setAuthenticated] = useState(Cookies.exists('auth-cookie'));
    useEffect(() => {
        console.log(authenticated);
    }, []);

    function logout() {
        setAuthenticated(false);
        Cookies.set('auth-cookie', '', -1);
    }

    function authenticate() {
        if (authenticated) {
            logout();
            return;
        }
        alert('TODO push to oauth URL');
        Cookies.set('auth-cookie', 'dummy', 1);
        setAuthenticated(true);
    }

    return {
        authenticated,
        authenticate,
        logout,
    };
}

export function useUserState() {
    return createContainer(userState);
}

export default useUserState();
