import React from 'react';
import { Slide } from '@material-ui/core';

export default function CategoriesDrawer() {
    return (
        <Slide in direction={'left'}>
            <div style={{ height: 2000 }}>Categories</div>
        </Slide>
    );
}
