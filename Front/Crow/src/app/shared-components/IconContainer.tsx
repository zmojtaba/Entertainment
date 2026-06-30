import { Box } from "@mui/material";
import TouchRipple, { TouchRippleActions } from "@mui/material/ButtonBase/TouchRipple";
import { alpha } from "@mui/system";
import { PropsWithChildren, useRef } from "react";

type PropsType = PropsWithChildren<{ color: string, disableRipple?: boolean }>

export const IconContainer = (props: PropsType) => {
    const { color, children, disableRipple } = props;
    const rippleRef = useRef<TouchRippleActions>(null);

    const onRippleStart = (e) => {
        rippleRef.current!.start(e);
    };
    const onRippleStop = (e) => {
        rippleRef.current!.stop(e);
    }
    return (
        <Box
            onMouseDown={onRippleStart}
            onMouseUp={onRippleStop}
            sx={{
                borderRadius: 1,
                position: 'relative',
                padding: .9,
                bgcolor: ({ palette }) => alpha(palette?.[color]?.light, .15),
                width: 'fit-content',
                '& >*': {
                    color: color + '.dark'
                },
                mb: 1
            }}>
            {children}
            {!disableRipple && <TouchRipple ref={rippleRef} center={false} />}
        </Box>)
}
