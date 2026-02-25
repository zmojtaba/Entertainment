import { GridValueFormatter } from "@mui/x-data-grid"

const getRowIndex: GridValueFormatter = (v, r, c, api) => {
    return api.current.getSortedRowIds().indexOf(r?.id) + 1
}
export default getRowIndex