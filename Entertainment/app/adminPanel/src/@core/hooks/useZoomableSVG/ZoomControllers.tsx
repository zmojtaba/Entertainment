import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, ButtonGroup } from '@mui/material';

export default function ZoomControllers() {
    return (
        <div
            id='svg-zoom-controllers'
            style={{
                position: "absolute",
                left: 10,
                top: 5,
                // border:'1px solid red'
            }}>
            <ButtonGroup variant='contained' color='info' size='small'>
                <Button id='svg-zoomIn' >
                    <AddIcon />
                </Button>
                <Button id='svg-zoomOut'  >
                    <RemoveIcon />
                </Button>
                <Button id='svg-resetZoom' >
                    <RestartAltIcon />
                </Button>
            </ButtonGroup>
        </div >
    )
}
