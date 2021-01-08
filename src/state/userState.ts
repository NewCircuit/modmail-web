import { useState } from 'react';
import { createContainer } from 'unstated-next';

type State = FG.State.UserState;

function userState(): State {
    const [authenticated, setAuthenticated] = useState(
        sessionStorage.getItem('test') === '1'
    );

    function authenticate() {
        setAuthenticated(!authenticated);
        sessionStorage.setItem('test', !authenticated ? '1' : '0');
    }

    return {
        authenticated,
        authenticate,
        todo: 'help me!',
    };
}

export function useUserState() {
    return createContainer(userState);
}

export default useUserState();
