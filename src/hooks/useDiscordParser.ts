import { ShowdownExtension } from '@demitchell14/react-showdown';
import { useRef, useState, FunctionComponent, lazy } from 'react';

type ExtensionCallback = (match: string, offset: number, content: string) => string;
type Exts = Array<{
    pattern: RegExp;
    callback: ExtensionCallback | Promise<ExtensionCallback>;
}>;

export type ParserProps = {
    category: string;
    id: string;
};
type ParserComponent = FunctionComponent<ParserProps>;

type AvailableParsers = 'DiscordRole' | 'DiscordChannel' | 'DiscordUser' | string;

type ParserComponents = {
    [s in AvailableParsers]: ParserComponent;
};

export type Extension = ShowdownExtension;

type DiscordParserProps = {
    components?: Array<string | ParserComponent>;
    extensions?: Extension[];
};

// TODO list all discord parser components here
const availableParserComponents: ParserComponents = {
    DiscordRole: lazy(() => import('../components/discord/DiscordRole')),
    DiscordChannel: lazy(() => import('../components/discord/DiscordChannel')),
    DiscordUser: lazy(() => import('../components/discord/DiscordUser')),
};

const defaultProps = {
    components: [],
    extensions: [],
};

function getDefaultComponents(
    components: Array<string | ParserComponent>
): ParserComponents {
    const parsers: ParserComponents = {};
    components.forEach((component) => {
        if (typeof component === 'string') {
            parsers[component] = availableParserComponents[component];
        } else {
            parsers[component.name] = component;
        }
    });
    return parsers;
}

export default function useDiscordParser(props: DiscordParserProps = defaultProps) {
    const [extensions, setExtensions] = useState<Extension[]>(
        props.extensions as Extension[]
    );
    const { current: components } = useRef<ParserComponents>(
        getDefaultComponents(props.components as Array<string | ParserComponent>)
    );

    // function attachExtension(pattern: RegExp, callback: ExtensionCallback) {
    //     // ---
    //     setExtensions([
    //         ...extensions,
    //         {
    //             type: 'lang',
    //             regex: pattern,
    //             replace: callback,
    //         },
    //     ]);
    // }
    //
    // function attachExtensions(exts: Exts) {
    //     const nextExtensions = exts.map((ext) => {
    //         return {
    //             type: 'lang',
    //             regex: ext.pattern,
    //             replace: ext.callback,
    //         };
    //     });
    //
    //     setExtensions(nextExtensions);
    // }

    return {
        extensions,
        components,
    };
}
