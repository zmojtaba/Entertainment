import { useTranslation } from 'react-i18next';
interface PropsType {
    msg: string;
    code?: number;
}
export default function ToastMsg(props: PropsType) {
    const { msg, code } = props;
    const { t } = useTranslation("layout")

    return (
        <div style={{ whiteSpace: 'pre-line' }}>
            {msg}
            {code ? ('\r\n' + t('ERROR_CODE') + ' ' + code) : ''}
        </div>
    )
}
