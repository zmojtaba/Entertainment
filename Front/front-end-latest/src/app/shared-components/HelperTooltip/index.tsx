import React, { ReactElement } from 'react'
import classes from './style.module.scss'
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import { Modify } from 'app/services/utils/public_types';

interface PropsType extends Modify<TooltipProps, { children?: ReactElement }> {}

export default function Index({ children, ...otherProps }: PropsType) {

  return (
    <div className={classes.tooltip}>
      <Tooltip {...otherProps}  >
        {children ?? <HelpIcon />}
      </Tooltip>
    </div>
  )
}
