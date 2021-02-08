import { ShowdownExtension } from 'react-showdown';
import { useState } from 'react';

type ExtensionCallback = (match: string, offset: number, content: string) => string;
type Exts = Array<{
    pattern: RegExp;
    callback: ExtensionCallback | Promise<ExtensionCallback>;
}>;

export const useDiscordParser = () => {
    const [extensions, setExtensions] = useState<ShowdownExtension[]>([]);

    function attachExtension(pattern: RegExp, callback: ExtensionCallback) {
        // ---
        setExtensions([
            ...extensions,
            {
                type: 'lang',
                regex: pattern,
                replace: callback,
            },
        ]);
    }

    function attachExtensions(exts: Exts) {
        const nextExtensions = exts.map((ext) => {
            return {
                type: 'lang',
                regex: ext.pattern,
                replace: ext.callback,
            };
        });

        setExtensions(nextExtensions);
    }

    return {
        extensions,
        attachExtension,
        attachExtensions,
    };
};

type Extensions = {
    [s: string]: ShowdownExtension;
};

export const extensions: Extensions = {
    /**
     * parses discord emoji codes into <img /> tags with the emoji
     * Example: <:rollfac:782028976263528458>
     */
    emoji: {
        type: 'lang',
        regex: /<:[a-z0-9]+:\d+>/gim,
        replace: (matched, offset, content) => {
            const parts = /<:[a-z0-9]+:(\d+)>/gim.exec(matched);
            if (parts) {
                const url = `https://cdn.discordapp.com/emojis/${parts[1]}.png`;
                const size = 32;
                return `<img src="${url}?size=${size}" height="${size}" />`;
            }
            return matched;
        },
    },
};

export function getExtensions() {
    return [extensions.emoji];
}
