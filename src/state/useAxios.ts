import { useRef } from 'react';
import axiosRaw, { AxiosInstance } from 'axios';

export default function useAxios() {
    const { current: axios } = useRef<AxiosInstance>(
        axiosRaw.create({
            validateStatus: () => true,
        })
    );

    return { axios };
}
