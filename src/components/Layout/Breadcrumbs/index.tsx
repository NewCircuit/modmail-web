import React from 'react';
import { Breadcrumbs as BreadcrumbsBase, Link, Typography } from '@material-ui/core';

// TODO make this functional
export default function Breadcrumbs() {
    return (
        <BreadcrumbsBase>
            <Link href={'#'}>Home</Link>
            <Link href={'#'}>Minecraft</Link>
            <Typography color={'textPrimary'}>Threads</Typography>
        </BreadcrumbsBase>
    );
}
