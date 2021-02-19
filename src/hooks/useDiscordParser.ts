import { ShowdownExtension } from 'react-showdown';
import { useState } from 'react';

type ExtensionCallback = (match: string, offset: number, content: string) => string;
type Exts = Array<{
    pattern: RegExp;
    callback: ExtensionCallback | Promise<ExtensionCallback>;
}>;

export default function useDiscordParser() {
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
}
