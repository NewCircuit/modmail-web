import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { Category, Thread } from 'modmail-types';
import axios, { AxiosResponse, Canceler } from 'axios';
import { useTranslation } from 'react-i18next';
import { FG, Nullable, Optional } from '../types';

type State = FG.State.NavigationState;

const TEST_CATEGORIES = JSON.parse(
    `[{"channelID":"718600449892024320","emojiID":"⭐","guildID":"718433475828645928","id":"791054121502375937","isActive":false,"name":"Old Floor Gang"},{"channelID":"804073543255982082","emojiID":"🎮","guildID":"804061001259155466","id":"804074878234918963","isActive":true,"name":"Floor Gang"}]`
);

const TEST_THREAD = JSON.parse(`{
    "author": {
      "id": "573605217409695775"
    },
    "channel": "804074935114137671",
    "id": "803762111753879893",
    "isActive": false,
    "messages": [
      {
        "clientID": null,
        "content": "They don't have any mod logs at least",
        "edits": [
          
        ],
        "files": [
          
        ],
        "isDeleted": false,
        "modmailID": "804074942097915924",
        "sender": "142428300411797508",
        "internal": true,
        "threadID": "803762111753879893"
      }
    ],
    "category": "804074878234918963"
  }`);
const TEST_THREADS: Thread[] = [TEST_THREAD, TEST_THREAD, TEST_THREAD, TEST_THREAD];

function navigationState(defaultProps: any): State {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Optional<Category[]>>(undefined);
    const [threads, setThreads] = useState<Optional<Thread[]>>(undefined);
    const [threadsCancelToken, setThreadsCancelToken] = useState<Optional<Canceler>>(
        undefined
    );

    useEffect(() => {
        console.log({ defaultProps });
    });

    function findCategoryById(id: string): Nullable<Category> {
        if (categories instanceof Array) {
            return categories.find((cat) => cat.id === id) || null;
        }
        return null;
    }

    // TODO remove TEMP Function
    function fetchCategories2(): Promise<Category[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('fetchCategories');
                setCategories(TEST_CATEGORIES);
                resolve(TEST_CATEGORIES);
            }, 2000);
        });
    }

    function fetchCategories(): Promise<Category[]> {
        console.log('Fetch Categories Now!');
        return axios
            .get(t('urls.categories'))
            .then((response: AxiosResponse<FG.Api.CategoriesResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    setCategories(response.data);
                    return response.data;
                }
                setCategories([]);
                return [];
            })
            .catch((err) => {
                console.error(err);
                setCategories([]);
                return [];
            });
    }

    // TODO remove TEMP Function
    function fetchOneCategory2(category: string): Promise<Nullable<Category>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(TEST_CATEGORIES.find((cat) => cat.id === category) || null);
            }, 2000);
        });
    }

    function fetchOneCategory(category: string): Promise<Nullable<Category>> {
        return axios
            .get(t('urls.categoryOne', { category }))
            .then((response: AxiosResponse<FG.Api.CategoryOneResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    return response.data;
                }
                return null;
            })
            .catch((err) => {
                console.error(err);
                return null;
            });
    }

    // TODO remove TEMP Function
    function fetchThreads2(category: string): Promise<Thread[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                setThreads(TEST_THREADS);
                resolve(TEST_THREADS);
            }, 2000);
        });
    }

    function fetchThreads(category: string): Promise<Thread[]> {
        console.log('Fetch Threads Now!');
        if (threadsCancelToken) {
            threadsCancelToken('new request made.');
        }
        const cancelTokenSource = axios.CancelToken.source();
        setThreadsCancelToken(cancelTokenSource.cancel);
        return axios
            .get(t('urls.threads', { category }), {
                cancelToken: cancelTokenSource.token,
            })
            .then((response: AxiosResponse<FG.Api.ThreadsResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    setThreads(response.data);
                    return response.data;
                }
                setThreads([]);
                return [];
            })
            .catch((err) => {
                console.error(err);
                setThreads([]);
                return [];
            });
    }

    // TODO remove TEMP Function
    function fetchOneThread2(
        category: string,
        thread: string
    ): Promise<Nullable<Thread>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(TEST_THREADS.find((th) => th.id === thread) || null);
            }, 2000);
        });
    }

    function fetchOneThread(category: string, thread: string) {
        return axios
            .get(t('urls.threadOne', { category, thread }))
            .then((response: AxiosResponse<FG.Api.ThreadsOneResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    return response.data;
                }
                return null;
            })
            .catch((err) => {
                console.error(err);
                return null;
            });
    }

    return {
        threads: {
            items: threads,
            fetch: fetchThreads,
            fetchOne: fetchOneThread,
            cancel: threadsCancelToken,
        },
        categories: {
            items: categories,
            fetch: fetchCategories,
            fetchOne: fetchOneCategory,
            findById: findCategoryById,
        },
    };
}

export function useNavigationState() {
    return createContainer(navigationState);
}

export default useNavigationState();
