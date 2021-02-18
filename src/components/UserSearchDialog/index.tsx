import React, { ComponentType, RefObject } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    styled,
    TextField,
} from '@material-ui/core';
import { Theme } from '../../theme';

type Props = {
    classes?: { [s: string]: string };
    theme?: Theme;
    ref?: RefObject<UserSearchDialog>;
    onSubmit?: (evt: React.SyntheticEvent<HTMLButtonElement>, value: string) => unknown;
};

type State = {
    open: boolean;
    value: string;
};

const styles = (theme: Theme) => ({});

export class UserSearchDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: '',
        };
    }

    private onChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ value: evt.target.value });

    private onSubmit = (evt: React.SyntheticEvent<HTMLButtonElement>) => {
        if (this.props.onSubmit) {
            this.props.onSubmit(evt, this.state.value);
            this.close(true);
        }
    };

    close = (clear = false) =>
        this.setState({ open: false, value: clear ? '' : this.state.value });

    open = () => this.setState({ open: true });

    render = () => {
        const { close, onChange, onSubmit } = this;
        const { open, value } = this.state;
        const closer = () => close();

        return (
            <Dialog open={open} onClose={closer} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">User History Lookup</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Search for a specific user by entering the users ID and pressing
                        Go
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="uid"
                        label="User ID"
                        type="text"
                        value={value}
                        onChange={onChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closer} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} color="primary">
                        Go
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };
}

export type UserSearchDialogProps = Props;
export default styled(UserSearchDialog)(styles as never, {
    withTheme: true,
});
