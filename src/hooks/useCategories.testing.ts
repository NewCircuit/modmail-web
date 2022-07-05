/* eslint-disable */
import { useEffect, useState } from 'react';
import { Category } from '@fg-devs/modmail-types';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { useAxios } from './index';
import { NC, Nullable, Optional } from '../types';
import { Logger } from '../util';

const logger = Logger.getLogger('useCategories.testing');

type Props = any;

const TEST_CATEGORIES: NC.Api.CategoriesResponse = JSON.parse(
    `[{"isPrivate":false,"channelID":"806363000357257276","emojiID":"🍆","description":"bruuuuuuuh","guildID":"806083557352144916","id":"809687214488420352","isActive":true,"name":"test"}]`
);

export default function useCategories(props?: Props) {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Optional<Category[]>>(undefined);
    const { axios } = useAxios();

    function fetchCategories(): Promise<Category[]> {
        logger.verbose(`fetching categories`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // reject(new AuthenticationError())
                setCategories(TEST_CATEGORIES);
                resolve(TEST_CATEGORIES);
            }, 2000);
        });
    }

    function fetchOneCategory(category: string): Promise<Nullable<Category>> {
        logger.verbose(`fetching category ${category}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(TEST_CATEGORIES.find((cat) => cat.id === category) || null);
            }, 2000);
        });
    }

    function findCategoryById(id: string): Nullable<Category> {
        if (categories instanceof Array) {
            return categories.find((cat) => cat.id === id) || null;
        }
        return null;
    }

    function resetCategories() {
        logger.verbose(`categories reset`);
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
