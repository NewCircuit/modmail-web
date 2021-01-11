import React, { useEffect } from 'react';
import { Slide } from '@material-ui/core';

export default function CategoriesDrawer() {
    useEffect(() => {
        console.log('CategoriesDrawer');
    }, []);
    return (
        <Slide in direction={'left'}>
            <div style={{ height: 2000 }}>Categories</div>
        </Slide>
    );
}
