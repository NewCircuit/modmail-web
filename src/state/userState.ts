import { useState } from 'react';
import { NC } from 'types';
import { createContainer } from 'unstated-next';
import { useTranslation } from 'react-i18next';
import { Logger } from '../util';
import { useAxios } from '../hooks';

const logger = Logger.getLogger('userState');

type State = NC.State.UserState;

function userState(): State {
    const { t } = useTranslation();
    const { axios } = useAxios();
    const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);
    const [processing, setProcessing] = useState(false);
    const [userData, setUserData] = useState<NC.Api.SelfResponse | undefined>();

    function logout() {
        logger.verbose(`logging user out`);
        return axios
            .post(t('urls.logout'))
            .then((response) => {
                if (response.status === 200) {
                    setAuthenticated(false);
                } else {
                    logger.fatal({
                        message: 'unable to log out',
                        data: response,
                    });
                }
            })
            .catch((err) => {
                logger.fatal({
                    message: 'unable to log out',
                    data: err,
                });
            });
    }

    /**
     * Reaches out to `/api/self`. If it receives a 200 status code, the current user is logged in.
     * @param {boolean?} update if true, we will update user state. otherwise, this is just used to check current status
     * @returns Promise<boolean>
     */
    function authenticate(update = true): Promise<boolean> {
        logger.verbose(`authenticating user`);
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
            .catch((err) => {
                logger.fatal({
                    message: 'unable to authenticate',
                    data: err,
                });
                setAuthenticated(false);
                setProcessing(false);
                return false;
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
