import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function FontBox() {
    const [fontSize, setFontSize] = useState(100);

    const handleFontChange = (actions: 'add' | 'reduce') => {
        let tempFontSize = 70;
        if (actions == 'add' && fontSize < 130) {
            tempFontSize = fontSize + 10
        } else {
            if (fontSize > 70) {
                tempFontSize = fontSize - 10
            }
        }
        setFontSize(tempFontSize)
        const html = document.documentElement;
        html.style.fontSize = `${(tempFontSize / 100) * 62.5}%`
    }
    
    return (

        <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={`${fontSize}%`}
            sx={{
                "& .MuiOutlinedInput-root": {
                    border: "none", // Removes the border
                    "& fieldset": {
                        border: "none", // Removes the default border from the fieldset
                    },
                },
                maxWidth: '130px',
                padding: 0,
                textAlign: 'center',
            }}
            inputProps={{
                style: { textAlign: 'center' }
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="end" style={{ padding: '0', margin: '0' }}>
                        <IconButton onClick={() => handleFontChange('add')}>
                            < AddIcon />
                        </IconButton>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end" style={{ padding: '0', margin: '0' }}>
                        <IconButton onClick={() => handleFontChange('reduce')}>
                            <RemoveIcon />
                        </IconButton>
                    </InputAdornment>
                ),
                sx: {
                    padding: '0',
                    margin: '0'
                }
            }}
        />
    )
}

export default FontBox