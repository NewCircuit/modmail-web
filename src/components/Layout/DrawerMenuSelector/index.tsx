import React from 'react';
import { Tab, Tabs } from '@material-ui/core';

type Props = {
    tab?: number;
    tabs?: string[];
    onChange?: (tab: number) => any;
};

export default function DrawerMenuSelector(props: Props) {
    const { tab, onChange, tabs } = props;
    const onClick = (idx: number) => () => {
        if (onChange) onChange(idx);
    };
    return (
        <Tabs variant={'fullWidth'} value={tab || 0}>
            {tabs?.map((t, idx) => (
                <Tab label={t} onClick={onClick(idx)} key={idx} />
            ))}
        </Tabs>
    );
}
