import { useEffect, useState } from 'react';
import { FG } from 'types';
import { createContainer } from 'unstated-next';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from '../util/Cookies';

type State = FG.State.UserState;

function userState(): State {
    const { t } = useTranslation();
    const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);
    const [processing, setProcessing] = useState(false);
    const [userData, setUserData] = useState<FG.Api.SelfResponse | undefined>();

    function logout() {
        setAuthenticated(false);
        Cookies.set(t('cookie'), '', -1);
    }

    /**
     * Reaches out to `/api/self`. If it receives a 200 status code, the current user is logged in.
     * @param {boolean?} update if true, we will update user state. otherwise, this is just used to check current status
     * @returns Promise<boolean>
     */
    function authenticate(update = true): Promise<boolean> {
        if (authenticated && !update) return Promise.resolve(true);
        setProcessing(true);
        return axios
            .get(t('urls.authenticate'))
            .then((response) => {
                if (update) {
                    if (response.status === 200) {
                        // logged in successfully
                        setUserData(response.data);
                    }

                    setAuthenticated(response.status === 200);
                }
                setProcessing(false);
                return response.status === 200;
            })
            .catch(() => {
                setAuthenticated(false);
                setProcessing(false);
                return false;
            });
    }

    function redirect() {
        document.location.assign(t('urls.oauth'));
    }

    return {
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
