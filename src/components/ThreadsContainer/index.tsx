import React, { ComponentType } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Paper } from '@material-ui/core';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import clsx from 'clsx';
import Alert from '../Alert';
import { MutatedThread, RequiredArgs } from '../../types';
import LocalizedBackdrop from '../LocalizedBackdrop';
import { ThreadListItemProps } from '../ThreadListItem';

type Child = ComponentType<RequiredArgs<{ thread: MutatedThread }>>;
type Props = {
    threads?: MutatedThread[];
    itemProps?: Partial<ThreadListItemProps>;
    loaded?: boolean;
    empty?: {
        title?: React.ReactNode;
        description?: React.ReactNode;
    };
    className?: string;
    children: Child;
};

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        height: 400,
        [theme.breakpoints.up('md')]: {
            height: 600,
        },
    },
    alert: {
        marginTop: '.5rem',
    },
}));

function itemRenderer(Component: Child, itemProps?: Partial<ThreadListItemProps>) {
    return function Item(props: ListChildComponentProps) {
        const threads: MutatedThread[] = props.data;
        const currentThread = threads[props.index];

        return (
            <div style={props.style}>
                <Component {...itemProps} thread={currentThread} />
            </div>
        );
    };
}

const Loading = () => (
    <LocalizedBackdrop open>
        <CircularProgress />
    </LocalizedBackdrop>
);

function ThreadsContainer(props: Props): JSX.Element {
    const { threads, children, empty, itemProps, loaded, className } = props;
    const classes = useStyles();
    const rootClasses = clsx(classes.root, className);

    if (!loaded)
        return (
            <Paper className={rootClasses} elevation={1}>
                <Loading />
            </Paper>
        );

    if (typeof threads === 'undefined' || threads.length === 0)
        return (
            <Alert
                className={classes.alert}
                color={'error'}
                alertTitle={empty?.title}
                alertDesc={empty?.description}
            />
        );

    const renderer = itemRenderer(children, itemProps);
    return (
        <Paper className={rootClasses} elevation={1}>
            <AutoSizer>
                {({ height, width }) => (
                    <FixedSizeList
                        itemCount={threads.length}
                        itemData={threads}
                        itemSize={150}
                        height={height}
                        width={width}
                    >
                        {renderer}
                    </FixedSizeList>
                )}
            </AutoSizer>
        </Paper>
    );
}

export type ThreadsContainerProps = Props;
export default ThreadsContainer;
