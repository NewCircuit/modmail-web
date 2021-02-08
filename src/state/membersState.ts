import { useState, useRef } from 'react';
import { FG, MemberState, Nullable } from 'types';
import { createContainer } from 'unstated-next';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';

type State = FG.State.MembersState;

const TEST_MEMBERS = JSON.parse(`[
  {
    "avatarURL": "https://cdn.discordapp.com/embed/avatars/1.png",
    "discriminator": "7956",
    "id": "806353915805040640",
    "username": "Modmail | Dev",
    "role": "",
    "nickname": ""
  },
  {
    "avatarURL": "https://cdn.discordapp.com/avatars/164837347156951040/8d290fdeed035b9bbf3c4095c6c07beb.webp",
    "discriminator": "5162",
    "id": "164837347156951040",
    "username": "dylhack",
    "role": "admin",
    "nickname": "Dylan"
  },
  {
    "avatarURL": "https://cdn.discordapp.com/avatars/217065422480998400/4ac7379ebf686b4c6b2d03547b5053d0.webp",
    "discriminator": "1777",
    "id": "217065422480998400",
    "username": "Bomber",
    "role": "admin",
    "nickname": ""
  },
  {
    "avatarURL": "https://cdn.discordapp.com/avatars/194024167052410880/b00c5e66215c97b53ff62a0a14bf4151.webp",
    "discriminator": "1709",
    "id": "194024167052410880",
    "username": "XInfinite_",
    "role": "admin",
    "nickname": ""
  },
  {
    "avatarURL": "https://cdn.discordapp.com/embed/avatars/3.png",
    "discriminator": "5103",
    "id": "806086102711795745",
    "username": "puppy1cam",
    "role": "",
    "nickname": ""
  },
  {
    "avatarURL": "https://cdn.discordapp.com/avatars/527881202225381387/a_d495bb7fbad6b952bfcd4f38524d99da.webp",
    "discriminator": "0001",
    "id": "527881202225381387",
    "username": "🌟RO🌟",
    "role": "mod",
    "nickname": "RO"
  }
]`);

type Fetchers = {
    [s: string]: {
        index: number;
        category: string;
        id: string;
        resolver?: (member: MemberState) => any;
        promise?: Promise<Nullable<MemberState>>;
    };
};

let num = 0;
function membersState(): State {
    const { t } = useTranslation();
    const [members, setMembers] = useState<MemberState[] | null>([]);
    const fetchers = useRef<Fetchers>({});

    const fetchMember = (category: string, id: string) => {
        let promise: Promise<Nullable<MemberState>>;
        if (typeof fetchers.current[id] !== 'undefined' && fetchers.current[id].promise) {
            promise = fetchers.current[id].promise as Promise<Nullable<MemberState>>;
        } else {
            promise = new Promise((resolve) => {
                if (typeof fetchers[id] === 'undefined') {
                    fetchers.current[id] = {
                        id,
                        category,
                        resolver: resolve,
                        // eslint-disable-next-line no-plusplus
                        index: ++num,
                    };
                }
                console.log('Promise Executed');

                // TODO remove test code
                // const timeout = Math.floor(Math.random() * 3000) + 500;
                // setTimeout(() => {
                //     const exists = TEST_MEMBERS.find((k) => k.id === id);
                //     if (exists) resolve(exists);
                //     else resolve(TEST_MEMBERS[0]);
                // }, timeout);

                axios
                    .get(t('urls.fetchMember', { category, member: id }))
                    .then((response: AxiosResponse<FG.Api.MemberResponse>) => {
                        if (response.status === 200) {
                            resolve(response.data);
                        } else {
                            resolve(null);
                        }
                    });
            });
            fetchers.current[id].promise = promise;
        }
        return promise;
    };

    function getMember(category: string, id: string) {
        return () =>
            new Promise((resolveMember) => {
                const exists = members?.find((mem) => mem.id === id);
                if (exists) {
                    resolveMember(exists);
                    return;
                }

                fetchMember(category, id).then((response) => resolveMember(response));
            });
    }

    function fetchMembers(category: string): Promise<FG.Api.MembersResponse> {
        // TEMP fix
        return new Promise((resolve) => {
            setMembers([]);
            return [];
        });
        // return axios
        //     .get(t('urls.fetchMembers', { category }))
        //     .then((response: AxiosResponse<FG.Api.MembersResponse>) => {
        //         if (response.status === 200) {
        //             setMembers(response.data);
        //             return response.data;
        //         }
        //         return [];
        //     });
    }

    return {
        members,
        fetchers,
        getMember,
        fetchMembers,
    } as any;
}

export function useMembersState() {
    return createContainer(membersState);
}

export default useMembersState();
