import { alpha, MenuItem, styled, Switch, SwitchProps } from "@mui/material";

export const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'transparent', // Remove hover background
    },
    '&.Mui-selected': {
        backgroundColor: 'transparent',
    },
    '&.Mui-selected:hover': {
        backgroundColor: 'transparent',
    },
}))

export const ThemeSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 35,
    height: 20,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            '& .MuiSwitch-thumb:before': {
                borderRadius: '50%',
                backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
                    `<svg  xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 25 20">
                       <path fill="${alpha(theme.palette.divider, 0.5)}"  d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03
                        9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 
                        0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1"/>
                    </svg>`
                )
                    }')`

            },
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.primary.dark,
                }),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 15,
        height: 16,
        backgroundColor: theme.palette.background.paper,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            ZIndex: 1000,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '50%',
            backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg  xmlns="http://www.w3.org/2000/svg" height="30" width="15" viewBox="0 0 24 23">                
                <path fill="${alpha(theme.palette.divider, 1)}" d="M11 4V2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1m7.36 3.05 1.41-1.42c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0l-1.41 1.42c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0M22 11h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1m-10 8c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1M5.64 7.05 4.22 5.64c-.39-.39-.39-1.03 0-1.41s1.03-.39 1.41 0l1.41 1.41c.39.39.39 1.03 0 1.41s-1.02.39-1.4 0m11.31 9.9c-.39.39-.39 1.03 0 1.41l1.41 1.41c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.41-1.41c-.38-.39-1.02-.39-1.41 0M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m3.64 6.78 1.41-1.41c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.03 0 1.41.38.39 1.02.39 1.41 0M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6"></path>                
                </svg>`
            )
                }')`

        },
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.primary.dark,
        }),
    },
}));

export const LanguageSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 35,
    height: 20,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: 'url(src/assets/images/flags/fa.png)',
                borderRadius: '50%'
            },
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.primary.dark,
                }),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 15,
        height: 16,
        backgroundColor: '#fff',
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: 'url(src/assets/images/flags/us.png)',
            borderRadius: '50%'
        }
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.primary.dark,
        }),
    },
}));


export const LockTaskBarSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: 'url(assets/images/flags/pinned.png)',
                borderRadius: '50%',
                transform: 'rotate(-45deg)'
            },
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: theme.palette.primary.dark,
                }),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
        backgroundColor: '#fff',
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: 'url(assets/images/flags/pinned.png)',
            borderRadius: '50%'
        }
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.primary.dark,
        }),
    },
}));