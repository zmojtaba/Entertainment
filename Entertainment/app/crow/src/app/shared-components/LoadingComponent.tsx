import { Backdrop, Typography, useTheme } from "@mui/material";
import { Theme, darken, lighten } from "@mui/system";
import { Triangle, DNA } from "react-loader-spinner";
interface PropsType {
    loading: boolean,
    message?: string,
    disableBackdrop?: boolean;
    color?: string | ((theme: Theme) => string)
}

export default function LoadingComponent(props: PropsType) {
    const { loading, message, disableBackdrop, color } = props;
    const theme = useTheme();
    const _color = (color && typeof color === "string") ? color : (color && typeof color === 'function') ? color(theme) : theme.palette.common.white

    return (
        loading ?
            <Backdrop open sx={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', direction: 'ltr',
                justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',
                ...(disableBackdrop && { backgroundColor: 'transparent' }),
                zIndex: 8000

            }}>
                <DNA
                    height={150}
                    width={150}
                    dnaColorOne={theme.palette.primary.main}
                    dnaColorTwo={_color}
                    visible={true}
                />
                {
                    message &&
                    <Typography fontSize={'2em'} sx={{ mt: 2, direction: 'ltr', color: (disableBackdrop ? darken : lighten)(_color, .4) }}>
                        {message}
                    </Typography>
                }
            </Backdrop >
            : null
    );
};
