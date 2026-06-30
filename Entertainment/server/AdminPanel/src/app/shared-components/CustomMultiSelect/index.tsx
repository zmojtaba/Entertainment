import { useCallback, useState, useMemo, memo, useEffect, useRef } from 'react'
import {
  Collapse, ListItemIcon, Select, Checkbox,
  ListItemButton, OutlinedInput, Box,
  ListItemText, TextField, ListItem, Divider,
  IconButton, FormControl, Stack, Typography, CircularProgress, Menu
} from "@mui/material";
import { grey } from '@mui/material/colors';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { SxProps } from '@mui/system';
import _ from 'lodash'
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";

/*------COUTION----!
 * put dataMap object outSide of your component 
 * for memoization porpose
 **/

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '0',
      padding: 0,
      display: 'none'
    },
  },
};

type options = Record<string, any>[]
/*
@Auhtor morgan 
  all right reserved :/
*/

export enum SelectMode {
  INITIALIZE = "Initialize",
  DELETE_ALL = "Delete All",
  INSERT_ALL = "Insert All",
  ADD_ITEM = "Add Item",
  DELETE_ITEM = "Delete Item",
  SELECT_ALL = "SELECT ALL"
}

interface PropsType {
  onSelectedChange(items: any[], mode?: SelectMode): void;
  selected: any[];
  dataMap: {
    name: string, //==>can be a path like: person.id.name
    children: string
  };
  disabled?: boolean;
  error?: boolean;
  options: options;
  sx?: SxProps;
  onToggleItem?(event: { item: any, enable: boolean }): void;
  keys: string[]; //sample==> ['id'], ['name','lastName',...]
  loading?: boolean
}

const OptionItemComp = memo((props: any) => {
  const { dataMap, isSelected, option, isShow } = props

  return (
    <ListItem
      sx={{
        display: isShow ? 'default' : 'none',
        opacity: 1,
        ':hover': {
          cursor: 'pointer',
          transform: 'translateX(2px)',
          bgcolor: ({ palette: { mode } }) => mode == 'dark' ? 'default' : isSelected ? grey[200] : grey[100],
          transition: 'transform .3s ease'
        },
      }}
      disableGutters
      key={option?.[dataMap.name]}
      onClick={() => props.onClick(option, isSelected)}
      selected={isSelected}>
      <Checkbox checked={isSelected} size='small' />
      <ListItemText primary={option?.[dataMap.name]} />
    </ListItem>
  )
})

const CollapseList = memo((props: any) => {
  const { option, selected, dataMap, filteredOptions, searchText, getId } = props
  const [open, setOpen] = useState(false)

  const items = useMemo(() => {
    const allItems: any[] = [];
    const refetch = (op) => {
      if (op[dataMap.children] && op[dataMap.children].length > 0) {
        op[dataMap.children].forEach(op => {
          if (op[dataMap.children] && op[dataMap.children].length > 0)
            refetch(op)
          else allItems.push(op)
        })
      }
    }
    refetch(option)
    return allItems
  }, [option])

  const isInFilteredList = Boolean(items.find(item => filteredOptions.find(i => getId(item) === getId(i))))
  const show = Boolean(searchText) ? isInFilteredList : true
  let isSelect = items.every(i => selected?.find?.(s => getId(s) == getId(i)))
  let isHalfSelect = !!items.find(i => selected?.find?.(s => getId(s) == getId(i)))

  return (
    <Box key={option.name}
      sx={{
        ml: .2,
        borderLeft: 1,
        borderLeftStyle: 'dashed',
        borderColor: 'divider',
        mr: .5,
        mt: .5,
        display: show ? 'block' : 'none',
        bgcolor: ({ palette: { mode } }) => mode == 'dark' ? 'default' : grey[50]
      }}>
      <ListItemButton sx={{ bgcolor: ({ palette: { mode } }) => mode == 'dark' ? 'default' : grey[200] }} dense selected={isSelect} onClick={() => { setOpen(o => !o) }} disableRipple >
        <ListItemIcon sx={{ ml: -2 }} onClick={(e) => { e.stopPropagation(); setOpen(false); props.onClick(items, isSelect) }}>
          <Checkbox checked={isSelect} indeterminate={isSelect ? false : isHalfSelect} disableRipple />
        </ListItemIcon>
        <ListItemText primary={option.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} mountOnEnter unmountOnExit sx={{ pl: .5 }} >
        {props.children}
      </Collapse>
    </Box>
  )
})

export default function CustomMultiSelect(props: PropsType) {
  const { dataMap: { name: NAME, children: CHILDREN } } = props
  const [selected, setSelected] = useState(props.selected);
  const [searchText, setSearchText] = useState('')
  const [selectMode, setSelectMode] = useState<SelectMode>(SelectMode.INITIALIZE)
  const [filteredOptions, setFilteredOptions] = useState<any[]>([])
  const { t } = useTranslation("general");
  const [openMenu, setOpenMenu] = useState(false)
  const inputRef = useRef<any>()


  //@ts-ignore
  const getId = useCallback((obj: object) => props.keys.map(k => obj?.[k]).join('-'), [])

  useEffect(() => {
    props.onSelectedChange?.(selected, selectMode)
  }, [selected])

  useEffect(() => {
    if (!_.isEqual(props.selected, selected))
      setSelected(props.selected)
  }, [props.selected])

  const handleClickItems = useCallback((op, isSelect = false) => {
    if (Array.isArray(op)) {
      if (isSelect) {//delete all
        setSelectMode(SelectMode.DELETE_ALL)
        setSelected(selected => {
          return selected.filter(s => !op.find(i => getId(i) == getId(s)))
        })
      } else { //insert all
        setSelectMode(SelectMode.INSERT_ALL)
        setSelected(selected => {
          return _.uniqBy([...selected, ...op], getId)
        })
      }
    } else {
      setSelected((selected) => {
        if (isSelect) {
          setSelectMode(SelectMode.DELETE_ITEM)
          return selected.filter(s => getId(s) !== getId(op))
        } else {
          setSelectMode(SelectMode.ADD_ITEM)
          return [...selected, op]
        }
      })
      props?.onToggleItem?.({ item: op, enable: !isSelect })
    }
  }, [setSelected])

  const renderSelectedLabel = () => {
    const TextWrapper = (text: string) => <Typography textAlign={'center'} noWrap > {text}   </Typography>
    let selectedItems = typeof selected?.[0] === 'object' ?
      selected.map(s => _.at(s, NAME)?.[0]) : selected
    if (props?.loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress color="inherit" size={20} />
          <Typography variant='caption' sx={{ ml: 2 }} >
            loading options
          </Typography>
        </Box>)

    } else {
      if (selectedItems?.length > 0) {
        if (selectedItems.length < 6)
          return TextWrapper(selectedItems.join(', '));
        return TextWrapper(`${selectedItems.length} ${t('SELECTED_ITEMS')}`);
      } else {
        return TextWrapper(t('NONE_SELECTED'))
      }
    }
  }

  const handleSearch = ({ target: { value } }) => {
    const newOptions: any[] = []
    setSearchText(value)
    let searchValue = value.toLowerCase();
    if (value.length == 0) {
      setFilteredOptions([])
      return
    }
    const filterOptions = (options) => {
      options.forEach(op => {
        if (typeof op === 'object') {
          if (op?.[CHILDREN]?.length) {
            filterOptions(op[CHILDREN])
          }
          else if (_.at(op, NAME)?.[0]?.toLowerCase()?.includes(searchValue)) newOptions.push(op) //is simple object  
        } else if (op.indexOf(searchValue) !== -1) newOptions.push(op) //is not object
      })
    }
    filterOptions(props.options)
    setFilteredOptions(newOptions)
  }

  const renderOptions = (options) => {
    return options.map(op => {
      if (op?.[CHILDREN] && op[CHILDREN].length)
        return (
          <CollapseList
            key={op?.[NAME]}
            dataMap={props.dataMap}
            option={op}
            onClick={handleClickItems}
            selected={selected}
            filteredOptions={filteredOptions}
            searchText={searchText}
            getId={getId}
          >
            {renderOptions(op[CHILDREN])}
          </CollapseList>
        )
      return (
        <OptionItemComp
          option={op}
          key={getId(op)}
          dataMap={props.dataMap}
          isSelected={!!selected?.find(s => getId(s) == getId(op))}
          onClick={handleClickItems}
          isShow={searchText ? !!filteredOptions.find(f => f?.[NAME] == op?.[NAME]) : true} />
      )
    })
  }

  const handleClean = () => {
    setSelected([])
  }
  const handleSelectAll = () => {
    setSelected(props.options)
  }

  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  return (
    <FormControl sx={{ minWidth: 100, width: '100%', ...props?.sx }}>
      <Select
        multiple
        value={selected}
        renderValue={() => renderSelectedLabel()}
        input={<OutlinedInput ref={inputRef} />}
        MenuProps={MenuProps}
        autoComplete='off'
        displayEmpty
        size='small'
        disabled={props?.loading || props.disabled}
        error={props.error}
        onOpen={() => setOpenMenu(true)}
        onClose={handleCloseMenu}
        open={openMenu}
      >
      </Select>
      <Menu
        open={openMenu}
        onClose={handleCloseMenu}
        anchorEl={inputRef.current}
        PaperProps={{
          style: {
            width: inputRef && inputRef.current?.offsetWidth || 150,
          }
        }}
      >
        <TextField
          sx={{ "& fieldset": { border: 'none' }, }}
          size='small'
          onChange={handleSearch}
          value={searchText}
          fullWidth
          autoComplete='off'
          autoFocus
          InputProps={{
            startAdornment: <SearchIcon />,
            endAdornment:
              <Stack direction={'row'} spacing={0}>
                {searchText &&
                  <IconButton onClick={() => setSearchText('')} >
                    <CloseIcon fontSize='small' />
                  </IconButton>}
                <IconButton onClick={handleClean} sx={{ '&:hover': { transform: 'scale(1.1)' } }} >
                  <CleaningServicesIcon fontSize='small' />
                </IconButton>
                <IconButton onClick={handleSelectAll} sx={{ '&:hover': { transform: 'scale(1.1)' } }} >
                  <LibraryAddCheckIcon fontSize='small' />
                </IconButton>
              </Stack>
          }}
        />
        <Divider />
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', maxHeight: 450, }}>
          {searchText && filteredOptions.length == 0 ?
            <Typography textAlign={'center'} p={2}>
              هیج موردی یافت نشد.
            </Typography>
            : renderOptions(props.options)
          }
        </Box>
      </Menu>
    </FormControl>
  )
}
