/* eslint-disable */
import { useRef } from 'react';
import { Semaphore } from 'async-mutex';
import { NC, MemberState, Nullable, UserMap } from '../types';
import { Logger } from '../util';
const logger = Logger.getLogger('useMembers.Testing');

type Props = any;
type Members = NC.State.MemberMap;

const TEST_MEMBERS: MemberState[] = JSON.parse(`{
    "default": {
        "avatarURL": "https://cdn.discordapp.com/embed/avatars/1.png",
        "discriminator": "7956",
        "id": "806353915805040640",
        "username": "Modmail | Dev",
        "role": "",
        "nickname": ""
    },
    
    "602569683543130113": {
      "avatarURL": "https://cdn.discordapp.com/avatars/602569683543130113/feb88c820cfb25ac3ab10bf58b9fd34c.webp",
      "discriminator": "1037",
      "id": "602569683543130113",
      "username": "25"
    },
    "201600394353311744": {
      "avatarURL": "https://cdn.discordapp.com/avatars/201600394353311744/95419aa06d1bd741d1e919ca76cb1eaa.webp",
      "discriminator": "4564",
      "id": "201600394353311744",
      "username": "puppy0cam"
    },
    "164837347156951040": {
      "avatarURL": "https://cdn.discordapp.com/avatars/164837347156951040/9b9bab59195847162f76dd245b2f241b.webp",
      "discriminator": "5162",
      "id": "164837347156951040",
      "username": "dylhack"
    },
    "716538065681776653": {
      "avatarURL": "https://cdn.discordapp.com/avatars/716538065681776653/d38f63091c454b726f6dddb71d0b6761.webp",
      "discriminator": "7664",
      "id": "716538065681776653",
      "username": "25_alt"
    },
    "194024167052410880": {
      "avatarURL": "https://cdn.discordapp.com/avatars/194024167052410880/b00c5e66215c97b53ff62a0a14bf4151.webp",
      "discriminator": "1709",
      "id": "194024167052410880",
      "username": "XInfinite_"
    },
    "357918459058978816": {
      "avatarURL": "https://cdn.discordapp.com/avatars/357918459058978816/30c3382b42857edbe462727e9ef800bd.webp",
      "discriminator": "2071",
      "id": "357918459058978816",
      "username": "Matthew©℗®™"
    },
    "217065422480998400": {
      "avatarURL": "https://cdn.discordapp.com/avatars/217065422480998400/4ac7379ebf686b4c6b2d03547b5053d0.webp",
      "discriminator": "1777",
      "id": "217065422480998400",
      "username": "Bomber"
    }
  }`);

export default function useMembers(props?: Props): NC.State.MembersState {
    const userIndex = useRef(0);
    const { current: semaphore } = useRef<Semaphore>(new Semaphore(1));
    const { current: members } = useRef<Members>({});

    const fetchMember = (category: string, id: string) => {
        logger.verbose(`fetching member ${id}`);
        let promise: Promise<Nullable<MemberState>>;
        if (typeof members[id] !== 'undefined' && members[id].promise) {
            promise = members[id].promise as Promise<Nullable<MemberState>>;
        } else {
            promise = new Promise((resolve) => {
                if (typeof members[id] === 'undefined') {
                    members[id] = {
                        id,
                        category,
                        index: ++userIndex.current,
                    };
                }

                semaphore
                    .runExclusive(
                        async (): Promise<{
                            data: Nullable<MemberState>;
                        }> => {
                            const data: {
                                data: Nullable<MemberState>;
                            } = await new Promise((rr) => {
                                setTimeout(() => {
                                    if (TEST_MEMBERS[id]) {
                                        rr({
                                            data: TEST_MEMBERS[id] || null,
                                        } as any);
                                    } else {
                                        rr({ data: TEST_MEMBERS['default' as any] });
                                    }
                                }, 2000);
                            });
                            return data;
                        }
                    )
                    .then((response) => {
                        resolve(response.data);
                    });
            });
            members[id].promise = promise;
        }
        return promise;
    };

    function getMember(
        category: string,
        id: string
    ): () => Promise<Nullable<MemberState>> {
        return () =>
            new Promise((resolveMember) => {
                if (members[id] && members[id].promise) {
                    members[id].promise?.then((r) => resolveMember(r));
                    return;
                }

                fetchMember(category, id).then((response) => resolveMember(response));
            });
    }

    function addMembers(users: UserMap) {
        Object.keys(users).forEach((user) => {
            if (typeof members[user] === 'undefined') {
                members[user] = {
                    promise: Promise.resolve(users[user]),
                    id: users[user].id,
                    index: ++userIndex.current,
                };
            }
        });
    }

    return {
        members,
        cache: addMembers,
        fetch: fetchMember,
        get: getMember,
    };
}
