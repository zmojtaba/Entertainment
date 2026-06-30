import { changeLanguage, languageId } from 'app/store/i18nSlice'
import { LanguageSwitch } from '../navbar/styles'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'app/store/hooks'
import _ from 'lodash'

function ChangeLanguage() {
    const { t } = useTranslation('navigation')
    const dispatch = useAppDispatch()
    const currentLanguageId = useAppSelector(({ i18n }) => i18n.language)
    const handleToggleLanguage = (event: any) => {
        console.log(event);

        currentLanguageId == languageId.FARSI ?
            dispatch(changeLanguage(languageId.ENGLISH)) :
            dispatch(changeLanguage(languageId.FARSI))
    }
    return (
        <LanguageSwitch
            onClick={handleToggleLanguage}
            sx={{ m: 0.1 }}
            checked={currentLanguageId == languageId.FARSI} />
    )
}

export default ChangeLanguage