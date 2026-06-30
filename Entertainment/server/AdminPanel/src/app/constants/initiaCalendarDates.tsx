import moment from 'moment-jalaali'

export const initialCalendarDates = {
    start: moment().set({ hour: 0, minute: 0, second: 0 }),
    end: moment().set({ hour: 23, minute: 59, second: 59 }),
}
