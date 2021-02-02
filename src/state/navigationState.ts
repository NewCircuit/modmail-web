/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { Category, Thread } from 'modmail-types';
import axios, { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { FG, Nullable, Optional } from '../types';

type State = FG.State.NavigationState;

function navigationState(defaultProps: any): State {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Optional<Category[]>>(undefined);
    const [threads, setThreads] = useState<Optional<Thread[]>>(undefined);

    useEffect(() => {
        console.log({ defaultProps });
    });

    function findCategoryById(id: string): Nullable<Category> {
        if (categories instanceof Array) {
            return categories.find((cat) => cat.id === id) || null;
        }
        return null;
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

    function fetchThreads(category: string): Promise<Thread[]> {
        console.log('Fetch Threads Now!');
        return axios
            .get(t('urls.threads', { category }))
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

    function findThreadById(categoryId: string, threadId: string) {
        if (threads instanceof Array) {
            return (
                threads.find(
                    (thread) => thread.category === categoryId && thread.id === threadId
                ) || null
            );
        }
        return null;
    }

    return {
        threads: {
            items: threads,
            fetch: fetchThreads,
            fetchOne: fetchOneThread,
            findById: findThreadById,
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
