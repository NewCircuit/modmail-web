import React from 'react';
import { Breadcrumbs as BreadcrumbsBase, Link, Typography } from '@material-ui/core';

type Props = any;

// TODO make this functional
export default function Breadcrumbs(props: Props) {
    return (
        <BreadcrumbsBase>
            <Link href={'#'}>Home</Link>
            <Link href={'#'}>Minecraft</Link>
            <Typography color={'textPrimary'}>Threads</Typography>
        </BreadcrumbsBase>
    );
}
