/**
 * utility component for i18next.
 * escaping string values don't work correctly by default,
 * this wrapper has a workaround for it
 */
import React from 'react';
import { Trans, TransProps } from 'react-i18next';
import { unescape } from 'lodash';

const getUnescapeChildrenRef = (ref: any) =>
    ref &&
    ref.childNodes &&
    // eslint-disable-next-line consistent-return
    Array.from(ref.childNodes).forEach((node: any) => {
        if (!node.innerText) {
            return node;
        }

        // eslint-disable-next-line no-param-reassign
        node.innerText = unescape(node.innerText);
    });

const UnescapedTrans = (props: TransProps<any>) => (
    <div ref={getUnescapeChildrenRef}>
        <Trans {...props} tOptions={{ interpolation: { escapeValue: true } }} />
    </div>
);

export default UnescapedTrans;
