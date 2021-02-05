import { useState } from 'react';
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

function membersState(): State {
    const { t } = useTranslation();
    const [members, setMembers] = useState<MemberState[] | null>(null);

    // TODO remove TEMP Function
    function fetchMember2(category: string, id: string): Promise<Nullable<MemberState>> {
        if (members === null) return Promise.resolve(null);

        const exists = members.find((member) => member.id === id);
        if (exists) return Promise.resolve(exists);

        return new Promise((resolve) => {
            const inTest = TEST_MEMBERS.find((member) => member.id === id);
            if (inTest) {
                resolve(inTest);
                return;
            }
            setTimeout(() => {
                resolve(TEST_MEMBERS[0]);
            }, 500);
        });
    }

    function fetchMember(category: string, id: string): Promise<Nullable<MemberState>> {
        if (members === null) return Promise.resolve(null);

        const exists = members.find((member) => member.id === id);
        if (exists) return Promise.resolve(exists);

        return axios
            .get(t('urls.fetchMember', { category, member: id }))
            .then((response: AxiosResponse<FG.Api.MemberResponse>) => {
                if (response.status === 200) {
                    setMembers((nextMembers) => [...(nextMembers || []), response.data]);
                    return response.data;
                }
                return null;
            });
    }

    // TODO remove TEMP Function
    function fetchMembers2(category: string): Promise<MemberState[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                setMembers(TEST_MEMBERS);
                resolve(TEST_MEMBERS);
            }, 5000);
        });
    }

    function fetchMembers(category: string) {
        return axios
            .get(t('urls.fetchMembers', { category }))
            .then((response: AxiosResponse<FG.Api.MembersResponse>) => {
                if (response.status === 200) {
                    setMembers(response.data);
                    return response.data;
                }
                return [];
            });
    }
    return {
        members,
        fetchMember,
        fetchMembers,
    };
}

export function useMembersState() {
    return createContainer(membersState);
}

export default useMembersState();
