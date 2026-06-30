import { Theme } from "@mui/material"
import * as d3 from 'd3';

export const convertPaletteToCSSVars = (palette: Theme['palette']): Record<string, string | number> => {
    let result = {}
    Object.entries(palette).forEach(([key, value]) => {
        if (typeof value === 'object') {
            let tempObj = {} as Theme['palette'];
            // console.log("tempObj",tempObj);
            
            Object.keys(value).forEach(k => {
                tempObj[`${key}-${k}`] = value[k]
            })
            Object.assign(result, convertPaletteToCSSVars(tempObj))
        }
        else if (typeof value !== 'function') {
            const c = d3.color(value)?.rgb()
            result[`--${key}`] = c ? `${c.r},${c.g},${c.b}` : value
        }
    })
    return result
}
