import _ from 'lodash';
import { languageId } from 'app/store/i18nSlice';
import jmoment from 'jalali-moment'
import { DATE_FORMAT } from 'app/constants';
import validator from 'validator';
import { TFunction } from 'i18next';
import { API_CONFIG } from 'app/app-configs/apiConfig';
import { IFrameJSON, IMovie } from './public_types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fa';
import { ISeries } from 'app/pages/Series/store/type';
import { IMagazin } from 'app/pages/Magazin/store/type';
import moment from 'moment';


export const isRTSP = (url: string) => {
    const IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
    const IPv4AddressFormat = `(${IPv4SegmentFormat}[.]){3}${IPv4SegmentFormat}`;
    const RTSP_REGEX = new RegExp(`rtsp://[A-Za-z0-9]+:.+@${IPv4AddressFormat}:[0-9]{2,8}$`);
    return RTSP_REGEX.test(url)
}

export const createMovieName = (cameraList: any[]): string => {
    let names = _.map(cameraList, 'name'),
        newName = '';
    for (let i = 1; i <= names.length + 1; i++) {
        if (!names.includes(`camera-${i}`)) {
            newName = `camera-${i}`
            break;
        }
    }
    return newName
}


export const createMovie_Schema = (): IMovie => {
    return {
        id: '',
        title: '',
        actors: [],
        ageGroup: '',
        countries: [],
        description: '',
        directors: [],
        genres: [],
        imdbRating: '',
        languages: [],
        posterImageUrl: '',
        publishedDate: '',
        streamUrl: '',
        subtitle:''
    }
}
export const createMagazin_Schema = (): IMagazin => {
    return {
        id: '',
        title: '',
        genres: [],
        languages: [],
        posterImageUrl: '',
        publishedDate: moment().utc().unix(),
        publisher: { name: '', imagePath: '' },
        streamUrl: ''
    }
}
export const createSeries_Schema = (): ISeries => {
    return {
        id: '',
        title: '',
        actors: [],
        ageGroup: '',
        countries: [],
        description: '',
        directors: [],
        genres: [],
        imdbRating: '',
        languages: [],
        posterImageUrl: '',
        publishedDate: '',
        seasons: []
    }
}

export const dateFormatter = (date: string, lang: languageId): string => {
    // const date1 = Math.floor(Date.now() / 1000);
    return jmoment.unix(parseInt(date.toString(), 10)).locale(lang === languageId.ENGLISH ? "en" : "fa").format(lang === languageId.ENGLISH ? DATE_FORMAT.gregorian : DATE_FORMAT.jalali)
}

export const convertToRelativeTime = (timestamp: number): string => {
    dayjs.extend(relativeTime);
    dayjs.locale('fa');
    return dayjs(timestamp * 1000).fromNow();
}

//------------------------Validate Data-----------------------------------------//

export const _CameraRules_detections = {
    lat: { required: true, lat: true, numeric: true, },
    lng: { required: true, lng: true, numeric: true, },
    h: { numeric: true, lat: true, },
    v: { numeric: true, lng: true },
    url: {
        required: true, //rtsp: true 
    },
    segments: {
        required: true,
    }
}
export const _CameraRules = {
    url: {
        required: true, //rtsp: true 
    },
    name: { require: true }
}

export const validateName = (name: string) => {
    if (validator.isEmpty(name))
        return 'ENTER_A_VALUE'
    if (name.length < 3)
        return 'VALUE_TOO_SHORT'
    if (name.length > 20)
        return 'VALUE_TOO_LONG'
    if (validator.isNumeric(name))
        return 'ONLY_NUMERIC_VALUES_NOT_VALID'
    return ''
}
export const validateComboBoxItem = (selectedItem: string[]) => {

}

type FormRulesType = {
    [key: string]: {
        [key: string]: any
    }
}
const isLongitude = num => isFinite(num) && Math.abs(num) <= 180;
const isLatitude = num => isFinite(num) && Math.abs(num) <= 90;

export const dataValidator = (data: Record<string, any>, rules: FormRulesType, t: TFunction): Record<string, string> => {
    let errors = {};
    Object.keys(data).forEach(field => {
        if (rules.hasOwnProperty(field)) {
            let fieldError: string = '';
            let val = String(data[field]);
            if (rules[field].true) {
                if (!val) {
                    fieldError = t("MUST_CHECKED");
                }
            } else {
                if (rules[field].required && validator.isEmpty(val)) {
                    fieldError = t("VALUE_REQUIRED")
                }
                if (!validator.isEmpty(val)) {
                    if (rules[field].minlength
                        && !validator.isLength(val, { min: rules[field].minlength })) {
                        fieldError = `${t('MIN_CHARACTER')} ${rules[field].minlength}`;
                    }
                    else if (rules[field].alpha && !validator.isAlpha(val)) {
                        fieldError = t("ENTER_ONLY_LETTERS")
                    }
                    else if (rules[field].email && !validator.isEmail(val)) {
                        fieldError = t('ENTER_VALID_MAIL')
                    }
                    else if (rules[field].numeric && !validator.isNumeric(val)) {
                        fieldError = t("ENTER_ONLY_NUMBERS")
                    }
                    else if (rules[field].mobile && !validator.isMobilePhone(val, ['fa-IR'])) {
                        fieldError = t('ENTER_VALID_PHONE')
                    }
                    else if (rules[field].length && !validator.isLength(val, { min: rules[field].length, max: rules[field].length })) {
                        fieldError = `${t('CHARACTER_LENGTH')} ${rules[field].length}`
                    }
                    else if (rules[field].lat && !isLatitude(val)) {
                        fieldError = `${t('ENTER_VALUE_BETWEEN')} -90 +90`
                    }
                    else if (rules[field].lng && !isLongitude(val)) {
                        fieldError = `${t('ENTER_VALUE_BETWEEN')} -180 +180`
                    }
                    else if (rules[field].rtsp && !isRTSP(val)) {
                        fieldError = `${t('INVALID_CAMERA_LINK')}  'rtsp//:user:pass@ip:port'`
                    }
                }
            }
            errors[field] = fieldError;
        }
    })
    return errors;
}

export const convertRelToAbsPath = (path: string) => {
    return `${API_CONFIG.baseServerAddress}:${API_CONFIG.serverPort}${path}`
}

export const convertFrameJSONToDataURL = (frameJSON: IFrameJSON) => {
    return `data:image/jpg;base64,${frameJSON.frame}`
}
