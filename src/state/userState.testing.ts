/* eslint-disable */
import { useState } from 'react';
import { NC } from 'types';
import { createContainer } from 'unstated-next';
import { useTranslation } from 'react-i18next';
import { Logger } from '../util';

const logger = Logger.getLogger('userState.testing');

type State = NC.State.UserState;

const TEST_USER_DATA = JSON.parse(`{
  "id": "194024167052410880",
  "username": "XInfinite_",
  "avatar": "b00c5e66215c97b53ff62a0a14bf4151",
  "token": "pp4u0nE4CFTV56XMkM6vXPIi1oCgGE",
  "discriminator": "1709",
  "public_flags": 0,
  "flags": 0,
  "locale": "en-US",
  "mfa_enabled": false
}`);

function userState(): State {
    const { t } = useTranslation();
    const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);
    const [processing, setProcessing] = useState(false);
    const [userData, setUserData] = useState<NC.Api.SelfResponse | undefined>();

    function logout() {
        setAuthenticated(false);
        return Promise.resolve();
    }

    /**
     * Reaches out to `/api/self`. If it receives a 200 status code, the current user is logged in.
     * @param {boolean?} update if true, we will update user state. otherwise, this is just used to check current status
     * @returns Promise<boolean>
     */
    function authenticate(update = true): Promise<boolean> {
        logger.verbose(`authorizing access`);
        if (authenticated && !update) return Promise.resolve(true);
        setProcessing(true);

        // TODO remove TEMP Function
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = { ...TEST_USER_DATA };
                if (update) {
                    setUserData(data);
                    setAuthenticated(true);
                }
                setProcessing(false);
                resolve(true);
            }, 1000);
        });
    }

    function redirect() {
        document.location.assign(t('urls.oauth'));
    }

    return {
        token: userData?.token || null,
        userId: userData?.id || null,
        authenticated,
        processing,
        redirect,
        authenticate,
        logout,
    };
}

export function useUserState() {
    return createContainer(userState);
}

export default useUserState();
