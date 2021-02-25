import { useRef } from 'react';
import axiosRaw, { AxiosInstance } from 'axios';

export default function useAxios(invalidStatus = [401]) {
    const { current: axios } = useRef<AxiosInstance>(
        axiosRaw.create({
            validateStatus: (status) => invalidStatus.indexOf(status) === -1,
        })
    );

    return { axios };
}
