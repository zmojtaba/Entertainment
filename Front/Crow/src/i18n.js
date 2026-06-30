import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { languageId } from "./app/store/i18nSlice"
import generalFa from "./app/constants/generalTranslation/fa"
import generalEn from "./app/constants/generalTranslation/en"
// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      UNABLE_TO_PROCESS: "Process Failed"
    }
  },
  fa: {
    translation: {
      UNABLE_TO_PROCESS: "عملیات ناموق!"
    }
  }
}

const storedLanguage = localStorage.getItem("languageId")
const storeLngId =
  storedLanguage && typeof storedLanguage !== "undefined"
    ? storedLanguage
    : languageId.FARSI
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: storeLngId,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })


i18n.addResourceBundle("fa", "general", generalFa)
i18n.addResourceBundle("en", "general", generalEn)

export default i18n
