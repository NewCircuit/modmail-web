/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { createContainer } from 'unstated-next';
import { Category, ChannelState, RoleState, Thread } from '@Floor-Gang/modmail-types';
import axiosRaw, { AxiosInstance, AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import {
    FG,
    Nullable,
    Optional,
    MutatedThread,
    DiscordTag,
    RoleTag,
    ChannelTag,
} from '../types';
import { MembersState } from './index';

type State = FG.State.NavigationState;

const TEST_CATEGORIES: FG.Api.CategoriesResponse = JSON.parse(
    `[{"channelID":"806363000357257276","emojiID":"🍆","description":"bruuuuuuuh","guildID":"806083557352144916","id":"809687214488420352","isActive":true,"name":"test"}]`
);

const TEST_THREADS_FULL: FG.Api.ThreadsResponse = JSON.parse(`[]`);

const TEST_THREAD = JSON.parse(
    `{"author":{"id":"602569683543130113"},"channel":"810064305538072606","id":"810064308779220992","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"810064272162816001","content":"e","edits":[],"files":[],"isDeleted":false,"modmailID":"810064309744959508","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810064324990468148","content":"ok","edits":[],"files":[],"isDeleted":false,"modmailID":"810064325816614952","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810064715296014356","content":"BrR","edits":[],"files":[],"isDeleted":false,"modmailID":"810064716005244958","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810064766185111592","content":"my name is yshikage kira","edits":[],"files":[],"isDeleted":false,"modmailID":"810064766881366056","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810067665225383946","content":"e","edits":[],"files":[],"isDeleted":false,"modmailID":"810067666038947850","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810067674737410098","content":"r","edits":[],"files":[],"isDeleted":false,"modmailID":"810067675397095454","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810067686221545512","content":"s","edits":[],"files":[],"isDeleted":false,"modmailID":"810067686725386261","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810067701900902450","content":"forward","edits":[],"files":[],"isDeleted":false,"modmailID":"810067702617341993","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":null,"content":"","edits":[],"files":[],"isDeleted":false,"modmailID":"810067910739492875","sender":"602569683543130113","internal":true,"threadID":"810064308779220992"},{"clientID":null,"content":"<@!164837347156951040> bot doesnt respond if msg starts with \`!\` , probably intended tho","edits":[],"files":[],"isDeleted":false,"modmailID":"810068048891346974","sender":"602569683543130113","internal":true,"threadID":"810064308779220992"},{"clientID":null,"content":"yeah","edits":[],"files":[],"isDeleted":false,"modmailID":"810068084411858964","sender":"164837347156951040","internal":true,"threadID":"810064308779220992"},{"clientID":null,"content":"because it's the prefix","edits":[],"files":[],"isDeleted":false,"modmailID":"810068101944705044","sender":"164837347156951040","internal":true,"threadID":"810064308779220992"},{"clientID":null,"content":"yeah","edits":[],"files":[],"isDeleted":false,"modmailID":"810068115089522698","sender":"602569683543130113","internal":true,"threadID":"810064308779220992"},{"clientID":"810068142893694997","content":"t","edits":[],"files":[],"isDeleted":false,"modmailID":"810068143611445259","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"},{"clientID":"810097461254422528","content":"Edit","edits":[],"files":[],"isDeleted":false,"modmailID":"810097461984231454","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"}],"category":"809687214488420352","users":{"602569683543130113":{"avatarURL":"https://cdn.discordapp.com/avatars/602569683543130113/9afacc058e488764dabb2bf2746e3654.webp","discriminator":"1037","id":"602569683543130113","username":"25"},"164837347156951040":{"avatarURL":"https://cdn.discordapp.com/avatars/164837347156951040/534ca1e9125ffab69dc6a37e8cd1ed6b.webp","discriminator":"5162","id":"164837347156951040","username":"dylhack"}}}`
);

const TEST_THREADS: FG.Api.ThreadsResponse = JSON.parse(
    `{"threads":[{"author":{"id":"602569683543130113"},"channel":"810162739779469373","id":"810162743322738690","isAdminOnly":false,"isActive":true,"messages":[{"clientID":null,"content":"ah","edits":[],"files":[],"isDeleted":false,"modmailID":"810218963987857418","sender":"164837347156951040","internal":true,"threadID":"810162743322738690"}],"category":"809687214488420352"},{"author":{"id":"357918459058978816"},"channel":"810130470732955668","id":"810130474625269761","isAdminOnly":false,"isActive":true,"messages":[{"clientID":null,"content":"Ah","edits":[],"files":[],"isDeleted":false,"modmailID":"810139220470661142","sender":"357918459058978816","internal":true,"threadID":"810130474625269761"}],"category":"809687214488420352"},{"author":{"id":"357918459058978816"},"channel":"810097234694766592","id":"810097237773385728","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"810130277627461643","content":" anonymous reply","edits":[],"files":[],"isDeleted":false,"modmailID":"810130277136334855","sender":"357918459058978816","internal":false,"threadID":"810097237773385728"}],"category":"809687214488420352"},{"author":{"id":"602569683543130113"},"channel":"810064305538072606","id":"810064308779220992","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"810097461254422528","content":"Edit","edits":[],"files":[],"isDeleted":false,"modmailID":"810097461984231454","sender":"602569683543130113","internal":false,"threadID":"810064308779220992"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809974638540881920","id":"809974642122031105","isAdminOnly":false,"isActive":true,"messages":[{"clientID":"810067207102791690","content":"r","edits":[],"files":[],"isDeleted":false,"modmailID":"810067207748321290","sender":"164837347156951040","internal":false,"threadID":"809974642122031105"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809917605568839720","id":"809917608961900544","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809917721591939164","content":"close","edits":[],"files":[],"isDeleted":false,"modmailID":"809917722325549097","sender":"164837347156951040","internal":false,"threadID":"809917608961900544"}],"category":"809687214488420352"},{"author":{"id":"217065422480998400"},"channel":"809893737547038760","id":"809891680261111808","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809893906799394866","content":" so colorful","edits":[],"files":[],"isDeleted":false,"modmailID":"809893906056478740","sender":"164837347156951040","internal":false,"threadID":"809891680261111808"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809891489877983262","id":"809890176959643648","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809890746441400350","content":"die","edits":[],"files":[],"isDeleted":false,"modmailID":"809890745535823872","sender":"164837347156951040","internal":false,"threadID":"809890176959643648"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809775130757824522","id":"809774749721952258","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809887821988233238","content":"die","edits":[],"files":[],"isDeleted":false,"modmailID":"809887821296173106","sender":"164837347156951040","internal":false,"threadID":"809774749721952258"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809774328463097878","id":"809774332233515009","isAdminOnly":false,"isActive":false,"messages":[],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809774145176862721","id":"809774148875321344","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809774132992278578","content":"test","edits":[],"files":[],"isDeleted":false,"modmailID":"809774149827559505","sender":"164837347156951040","internal":false,"threadID":"809774148875321344"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809771592690303006","id":"809771596117049346","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809771579302215691","content":"test","edits":[],"files":[],"isDeleted":false,"modmailID":"809771597455949874","sender":"164837347156951040","internal":false,"threadID":"809771596117049346"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809771032599986196","id":"809770747982643200","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809770999855054851","content":" test","edits":[],"files":[],"isDeleted":false,"modmailID":"809770998958260304","sender":"164837347156951040","internal":false,"threadID":"809770747982643200"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809769705484451880","id":"809766742128721920","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809769462327672843","content":"","edits":[],"files":[],"isDeleted":false,"modmailID":"809769461606383636","sender":"164837347156951040","internal":false,"threadID":"809766742128721920"}],"category":"809687214488420352"},{"author":{"id":"357918459058978816"},"channel":"809768891256406096","id":"809765458503925761","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809768808310767616","content":" test","edits":[],"files":[],"isDeleted":false,"modmailID":"809768807462862849","sender":"164837347156951040","internal":false,"threadID":"809765458503925761"}],"category":"809687214488420352"},{"author":{"id":"357918459058978816"},"channel":"809765179021066320","id":"809765183823151104","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809765357564854352","content":"","edits":[],"files":[],"isDeleted":false,"modmailID":"809765356679594004","sender":"201600394353311744","internal":false,"threadID":"809765183823151104"}],"category":"809687214488420352"},{"author":{"id":"357918459058978816"},"channel":"809763590906445875","id":"809762303359713283","isAdminOnly":false,"isActive":false,"messages":[{"clientID":null,"content":"UwU","edits":[],"files":[],"isDeleted":false,"modmailID":"809765044090306572","sender":"357918459058978816","internal":true,"threadID":"809762303359713283"}],"category":"809687214488420352"},{"author":{"id":"357918459058978816"},"channel":"809762000417587205","id":"809761933430489090","isAdminOnly":false,"isActive":false,"messages":[{"clientID":null,"content":"smh my head","edits":[],"files":[],"isDeleted":false,"modmailID":"809762212083662868","sender":"357918459058978816","internal":true,"threadID":"809761933430489090"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809761090472378378","id":"809761095962198017","isAdminOnly":false,"isActive":false,"messages":[],"category":"809687214488420352"},{"author":{"id":"477558125931790337"},"channel":"809759665822367774","id":"809759629453164544","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809759646515855360","content":" test","edits":[],"files":[],"isDeleted":false,"modmailID":"809759645274210355","sender":"164837347156951040","internal":false,"threadID":"809759629453164544"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809759455301599262","id":"809758301481992192","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809758375625228309","content":" test","edits":[],"files":[],"isDeleted":false,"modmailID":"809758374904332289","sender":"164837347156951040","internal":false,"threadID":"809758301481992192"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809744117273329674","id":"809744121525829637","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809744170561830923","content":"Cool","edits":[],"files":[],"isDeleted":false,"modmailID":"809744171383914506","sender":"201600394353311744","internal":false,"threadID":"809744121525829637"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809757306001555467","id":"809743487409979394","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809744178194939915","content":"testing user edits","edits":[],"files":[],"isDeleted":false,"modmailID":"809744178652250133","sender":"164837347156951040","internal":false,"threadID":"809743487409979394"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809743337421930526","id":"809743341372702721","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809743408460857375","content":" test","edits":[],"files":[],"isDeleted":false,"modmailID":"809743407768797224","sender":"164837347156951040","internal":false,"threadID":"809743341372702721"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809743217545052170","id":"809743222216720384","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809743309135151125","content":" etst","edits":[],"files":[],"isDeleted":false,"modmailID":"809743308074385419","sender":"164837347156951040","internal":false,"threadID":"809743222216720384"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809719104646676482","id":"809719112103231492","isAdminOnly":false,"isActive":false,"messages":[],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809718447553642546","id":"809717676443303939","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809718543603728384","content":"y","edits":[],"files":[],"isDeleted":false,"modmailID":"809718544211640338","sender":"201600394353311744","internal":false,"threadID":"809717676443303939"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809718503464370187","id":"809717652837761026","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809718621076193290","content":"bruh","edits":[],"files":[],"isDeleted":false,"modmailID":"809718621492215839","sender":"201600394353311744","internal":false,"threadID":"809717652837761026"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809742436665393152","id":"809716937872506880","isAdminOnly":false,"isActive":false,"messages":[{"clientID":null,"content":"l","edits":[],"files":[],"isDeleted":false,"modmailID":"809742599404650536","sender":"602569683543130113","internal":true,"threadID":"809716937872506880"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809709376495026198","id":"809709380256792579","isAdminOnly":false,"isActive":false,"messages":[{"clientID":null,"content":"wtf","edits":[],"files":[],"isDeleted":false,"modmailID":"809717147982102588","sender":"164837347156951040","internal":true,"threadID":"809709380256792579"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809709333117927474","id":"809709337365839874","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809717253443551262","content":"Lol","edits":[],"files":[],"isDeleted":false,"modmailID":"809717253820907532","sender":"201600394353311744","internal":false,"threadID":"809709337365839874"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809716369872388106","id":"809701626590920704","isAdminOnly":false,"isActive":false,"messages":[{"clientID":null,"content":"","edits":[],"files":[],"isDeleted":false,"modmailID":"809716359965048832","sender":"164837347156951040","internal":true,"threadID":"809701626590920704"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809700975228354581","id":"809700980353531904","isAdminOnly":false,"isActive":false,"messages":[],"category":"809687214488420352"},{"author":{"id":"602569683543130113"},"channel":"809698388307607563","id":"809698392975474688","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"810059127648682004","content":"https://cdn.discordapp.com/attachments/787448623351726080/809015752169619466/video0-9.mp4https://cdn.discordapp.com/attachments/787448623351726080/809015752169619466/video0-9.mp4","edits":[],"files":[],"isDeleted":false,"modmailID":"810059128520048680","sender":"602569683543130113","internal":false,"threadID":"809698392975474688"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809699806762500126","id":"809698276638064640","isAdminOnly":false,"isActive":false,"messages":[{"clientID":null,"content":"","edits":[],"files":[],"isDeleted":false,"modmailID":"809700473993035788","sender":"201600394353311744","internal":true,"threadID":"809698276638064640"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809692824923537459","id":"809692827662548996","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809693089215021066","content":"t","edits":[],"files":[],"isDeleted":false,"modmailID":"809693089844822027","sender":"201600394353311744","internal":false,"threadID":"809692827662548996"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809691407278800906","id":"809691410671468546","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809692592286466058","content":"t","edits":[],"files":[],"isDeleted":false,"modmailID":"809692593059135508","sender":"201600394353311744","internal":false,"threadID":"809691410671468546"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809691350064693288","id":"809691353415024641","isAdminOnly":false,"isActive":false,"messages":[],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809691330359853056","id":"809691334876200960","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809693173914796072","content":"test","edits":[],"files":[],"isDeleted":false,"modmailID":"809693174532538399","sender":"164837347156951040","internal":false,"threadID":"809691334876200960"}],"category":"809687214488420352"},{"author":{"id":"164837347156951040"},"channel":"809690641671913526","id":"809690645814968321","isAdminOnly":false,"isActive":false,"messages":[{"clientID":null,"content":"qw","edits":[],"files":[],"isDeleted":false,"modmailID":"809691281919442965","sender":"164837347156951040","internal":true,"threadID":"809690645814968321"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809688120235917363","id":"809688123784167424","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809690602005987338","content":" test","edits":[],"files":[],"isDeleted":false,"modmailID":"809690600978120735","sender":"164837347156951040","internal":false,"threadID":"809688123784167424"}],"category":"809687214488420352"},{"author":{"id":"201600394353311744"},"channel":"809687475655016459","id":"809687479174168577","isAdminOnly":false,"isActive":false,"messages":[{"clientID":"809687568492134420","content":"t","edits":[],"files":[],"isDeleted":false,"modmailID":"809687569322868736","sender":"201600394353311744","internal":false,"threadID":"809687479174168577"}],"category":"809687214488420352"}],"users":{"602569683543130113":{"avatarURL":"https://cdn.discordapp.com/avatars/602569683543130113/9afacc058e488764dabb2bf2746e3654.webp","discriminator":"1037","id":"602569683543130113","username":"25"},"164837347156951040":{"avatarURL":"https://cdn.discordapp.com/avatars/164837347156951040/534ca1e9125ffab69dc6a37e8cd1ed6b.webp","discriminator":"5162","id":"164837347156951040","username":"dylhack"},"357918459058978816":{"avatarURL":"https://cdn.discordapp.com/avatars/357918459058978816/30c3382b42857edbe462727e9ef800bd.webp","discriminator":"2071","id":"357918459058978816","username":"Matthew©℗®™"},"217065422480998400":{"avatarURL":"https://cdn.discordapp.com/avatars/217065422480998400/4ac7379ebf686b4c6b2d03547b5053d0.webp","discriminator":"1777","id":"217065422480998400","username":"Bomber"},"201600394353311744":{"avatarURL":"https://cdn.discordapp.com/avatars/201600394353311744/95419aa06d1bd741d1e919ca76cb1eaa.webp","discriminator":"4564","id":"201600394353311744","username":"puppy0cam"},"477558125931790337":{"avatarURL":"https://cdn.discordapp.com/avatars/477558125931790337/d456baf0a5ec3612cabc30968d926cdb.webp","discriminator":"1035","id":"477558125931790337","username":"᠚᠚᠚᠚᠚᠚"}}}`
);

type DiscordTagHandlers = {
    [s: string]: Promise<DiscordTag>;
};
// TODO Rename to ModmailState since this isn't actually navigation state at all anymore
function navigationState(defaultProps: any): State {
    const { t } = useTranslation();
    const { getMember, addMembers } = MembersState.useContainer();
    const [categories, setCategories] = useState<Optional<Category[]>>(undefined);
    const [threads, setThreads] = useState<Optional<MutatedThread[]>>(undefined);
    const { current: discordTagPromises } = useRef<DiscordTagHandlers>({});

    const { current: axios } = useRef<AxiosInstance>(
        axiosRaw.create({
            validateStatus: () => true,
        })
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
    function fetchThreads2(category: string): Promise<MutatedThread[]> {
        console.log('Fetch Threads Now!');
        return new Promise((resolve) => {
            setTimeout(() => {
                const x = TEST_THREADS.threads.map((thread) => {
                    return {
                        ...thread,
                        author: {
                            id: thread.author.id,
                            data: getMember(thread.author.id, thread.category),
                        },
                        messages: thread.messages.map((message) => ({
                            ...message,
                            sender: {
                                id: message.sender,
                                data: getMember(message.sender, thread.category),
                            },
                        })),
                    } as MutatedThread;
                }) as MutatedThread[];
                console.log(x);
                addMembers(TEST_THREADS.users);
                setThreads(x);
                resolve(x);
            }, 2000);
        });
    }

    function fetchThreads(category: string): Promise<MutatedThread[]> {
        console.log('Fetch Threads Now!');
        return axios
            .get(t('urls.threads', { category }))
            .then((response: AxiosResponse<FG.Api.ThreadsResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    const mutated = response.data.threads.map((thread) => {
                        return {
                            ...thread,
                            author: {
                                id: thread.author.id,
                                data: getMember(thread.author.id, thread.category),
                            },
                            messages: thread.messages.map((message) => ({
                                ...message,
                                sender: {
                                    id: message.sender,
                                    data: getMember(message.sender, thread.category),
                                },
                            })),
                        } as MutatedThread;
                    }) as MutatedThread[];

                    addMembers(response.data.users);
                    setThreads(mutated);
                    return mutated;
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
    ): Promise<Nullable<MutatedThread>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newThread: FG.Api.ThreadsOneResponse = TEST_THREAD;
                // const newThread: Thread | undefined = TEST_THREADS_FULL.threads.find(
                //     (th) => th.id === thread
                // );
                if (newThread) {
                    addMembers(newThread.users);
                    resolve({
                        ...newThread,
                        author: {
                            id: newThread.author.id,
                            data: getMember(newThread.author.id, category),
                        },
                        messages: newThread.messages.map((message) => ({
                            ...message,
                            sender: {
                                id: message.sender,
                                data: getMember(message.sender, category),
                            },
                        })),
                    });
                } else {
                    const th = TEST_THREADS_FULL[0];
                    addMembers(th.users);
                    resolve({
                        ...th,
                        author: {
                            id: th.author.id,
                            data: getMember(category, th.author.id),
                        },
                        messages: th.messages.map((message) => ({
                            ...message,
                            sender: {
                                id: message.sender,
                                data: getMember(message.sender, category),
                            },
                        })),
                    });
                }
            }, 2000);
        });
    }

    function fetchOneThread(
        category: string,
        thread: string
    ): Promise<Nullable<MutatedThread>> {
        return axios
            .get(t('urls.threadsOne', { category, thread }))
            .then((response: AxiosResponse<FG.Api.ThreadsOneResponse>) => {
                console.log(response);
                if (response.status === 200) {
                    addMembers(response.data.users);
                    return {
                        ...response.data,
                        author: {
                            id: response.data.author.id,
                            data: getMember(category, response.data.author.id),
                        },
                        messages: response.data.messages.map((message) => ({
                            ...message,
                            sender: {
                                id: message.sender,
                                data: getMember(message.sender, category),
                            },
                        })),
                    };
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

    function fetchRole(category: string, role: string): Promise<RoleTag> {
        const promise = axios
            .get<FG.Api.RoleResponse>(t('urls.fetchRole', { category, role }))
            .then((response) => {
                if (response.status === 200 && response.data) {
                    return {
                        ...response.data,
                        color: response.data.color.toString(8),
                        exists: true,
                    };
                }
                return {
                    exists: false,
                    id: role,
                };
            });
        discordTagPromises[`role-${role}`] = promise;
        return promise;
    }

    function fetchChannel(category: string, channel: string): Promise<ChannelTag> {
        const promise = axios
            .get<FG.Api.ChannelResponse>(t('urls.fetchChannel', { category, channel }))
            .then((response) => {
                if (response.status === 200 && response.data) {
                    return {
                        ...response.data,
                        exists: true,
                    };
                }
                return {
                    exists: false,
                    id: channel,
                };
            });
        discordTagPromises[`channel-${channel}`] = promise;
        return promise;
    }

    function getRole(category: string, role: string): Promise<RoleTag> {
        return new Promise((resolve) => {
            if (typeof discordTagPromises[`role-${role}`] !== 'undefined') {
                discordTagPromises[`role-${role}`].then((response) => {
                    resolve(response as RoleTag);
                });
                return;
            }
            const promise = fetchRole(category, role);
            discordTagPromises[`role-${role}`] = promise;
            promise.then((response) => {
                resolve(response);
            });
        });
    }

    function getChannel(category: string, channel: string): Promise<ChannelTag> {
        return new Promise((resolve) => {
            if (typeof discordTagPromises[`channel-${channel}`] !== 'undefined') {
                discordTagPromises[`channel-${channel}`].then((response) => {
                    resolve(response as ChannelTag);
                });
                return;
            }
            const promise = fetchChannel(category, channel);
            discordTagPromises[`channel-${channel}`] = promise;
            promise.then((response) => {
                resolve(response);
            });
        });
    }

    function resetThreads() {
        setThreads([]);
    }

    function resetCategories() {
        setCategories([]);
    }

    return {
        threads: {
            items: threads,
            fetch: fetchThreads,
            fetchOne: fetchOneThread,
            findById: findThreadById,
            reset: resetThreads,
        },
        categories: {
            items: categories,
            fetch: fetchCategories,
            fetchOne: fetchOneCategory,
            findById: findCategoryById,
            reset: resetCategories,
        },
        roles: {
            fetch: fetchRole,
            get: getRole,
        },
        channels: {
            fetch: fetchChannel,
            get: getChannel,
        },
    };
}

export function useNavigationState() {
    return createContainer(navigationState);
}

export default useNavigationState();
