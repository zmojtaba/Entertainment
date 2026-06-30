import React from 'react';
import classes from './style.module.scss'
import clsx from 'clsx';
import { getSvgIconUtilityClass, SvgIcon, svgIconClasses } from '@mui/material';

interface PropsType {
  checked: boolean;
  onChange(checked: PropsType['checked']): void;
  checkedLabel: React.ReactNode;
  uncheckedLabel: React.ReactNode;
  disabled?: boolean;
  iconMode?: boolean
}

//controlled component
export default function Index(props: PropsType) {
  const { checked, onChange, checkedLabel, uncheckedLabel, disabled, iconMode } = props;
  const isIconMode = checkedLabel instanceof SVGElement



  const handleChange = (e) => {
    e.stopPropagation();
    if (!disabled)
      onChange(!checked);
  }

  return (
    <div
      onClick={handleChange}
      className={clsx(classes.switchWrapper, {
        [classes.disabled]: disabled,
        [classes.checked]: checked,
        [classes.iconMode]: iconMode
      })}>
      <span data-checked={checked}>{checkedLabel}</span>
      <span data-checked={!checked}>{uncheckedLabel}</span>
    </div>
  )
}
