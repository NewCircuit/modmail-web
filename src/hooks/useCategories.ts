import { useState } from 'react';
import { Category } from '@Floor-Gang/modmail-types';
import { AxiosError, AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { useAxios } from './index';
import { FG, Nullable, Optional } from '../types';
import { Logger } from '../util';
import { UserState } from '../state';

const logger = Logger.getLogger('useCategories');

export default function useCategories(): FG.State.CategoriesState {
    const { t } = useTranslation();
    const { logout } = UserState.useContainer();
    const [categories, setCategories] = useState<Optional<Category[]>>(undefined);
    const { axios } = useAxios();

    function fetchCategories(): Promise<Category[]> {
        logger.verbose(`fetch categories`);
        return axios
            .get(t('urls.categories'))
            .then((response: AxiosResponse<FG.Api.CategoriesResponse>) => {
                if (response.status === 200) {
                    setCategories(response.data);
                    return response.data;
                }
                setCategories([]);
                return [];
            })
            .catch((err: AxiosError) => {
                if (err.response && err.response.status === 401) {
                    logger.info('user got 401. no longer authenticated');
                    logout();
                }
                setCategories([]);
                return [];
            });
    }

    function fetchOneCategory(category: string): Promise<Nullable<Category>> {
        logger.verbose(`fetch category ${category}`);
        return axios
            .get(t('urls.categoriesOne', { category }))
            .then((response: AxiosResponse<FG.Api.CategoryOneResponse>) => {
                if (response.status === 200) {
                    return response.data;
                }
                return null;
            })
            .catch((err: AxiosError) => {
                if (err.response && err.response.status === 401) {
                    logger.info('user got 401. no longer authenticated');
                    logout();
                }
                return null;
            });
    }

    function findCategoryById(id: string): Nullable<Category> {
        if (categories instanceof Array) {
            return categories.find((cat) => cat.id === id) || null;
        }
        return null;
    }

    function resetCategories() {
        logger.verbose(`reset categories`);
        setCategories([]);
    }

    return {
        items: categories,
        fetch: fetchCategories,
        fetchOne: fetchOneCategory,
        findById: findCategoryById,
        reset: resetCategories,
    };
}
