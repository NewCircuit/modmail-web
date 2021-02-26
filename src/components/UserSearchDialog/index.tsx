import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    useTheme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type Props = {
    onSubmit?: (evt: React.SyntheticEvent<HTMLFormElement>, value: string) => unknown;
    toggle?: () => void;
};

type State = {
    open: boolean;
    value: string;
};

type FormProps = Props &
    State & {
        onChange: (evt: React.ChangeEvent<HTMLInputElement>) => unknown;
        close: () => void;
        isValid: boolean;
    };

export class UserSearchDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: '',
        };
    }

    private isValid() {
        return Boolean(this.state.value.match(/^\d+$/));
    }

    private onChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ value: evt.target.value });

    private onSubmit = (evt: React.SyntheticEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (this.props.onSubmit && this.isValid()) {
            this.props.onSubmit(evt, this.state.value);
            this.close(true);
        }
    };

    public close = (clear = false) =>
        this.setState({ open: false, value: clear ? '' : this.state.value });

    public open = () => this.setState({ open: true });

    public render = () => {
        const { close, onChange, onSubmit } = this;
        const { open } = this.state;
        const closer = () => close();

        return (
            <Dialog open={open} onClose={closer}>
                <Form
                    {...this.props}
                    {...this.state}
                    isValid={this.isValid()}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    close={closer}
                />
            </Dialog>
        );
    };
}

function Form(props: FormProps) {
    const { onSubmit, value, onChange, close, isValid } = props;
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <form onSubmit={onSubmit as any}>
            <DialogTitle>{t('dialogs.userLookup.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('dialogs.userLookup.description')}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="uid"
                    label={t('dialogs.userLookup.label')}
                    placeholder={t('dialogs.userLookup.placeholder')}
                    type="text"
                    helperText={
                        <b style={{ height: 12, color: theme.palette.primary.main }}>
                            {!isValid && t('dialogs.userLookup.validation')}
                        </b>
                    }
                    value={value}
                    onChange={onChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    {t('dialogs.userLookup.cancel')}
                </Button>
                <Button type={'submit'} color="primary">
                    {t('dialogs.userLookup.go')}
                </Button>
            </DialogActions>
        </form>
    );
}

export type UserSearchDialogProps = Props;
export default UserSearchDialog;
