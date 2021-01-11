import React, { useEffect } from 'react';
import { Slide } from '@material-ui/core';

export default function ThreadDrawer() {
    useEffect(() => {
        console.log('ThreadsDrawer');
    }, []);
    return (
        <Slide in direction={'right'}>
            <div>Threads</div>
        </Slide>
    );
}
