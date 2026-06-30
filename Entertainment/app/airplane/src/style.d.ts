declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.png" {
    const value: string;
    export default value;
}

declare module "*.jpg" {
    const value: string;
    export default value;
}

declare module "*.jpeg" {
    const value: string;
    export default value;
}

declare module "*.svg" {
    const value: string;
    export default value;
}

interface SmookProps {
    // اینجا propsهای کامپوننت رو تعریف کن، مثلاً:
    // speed?: number;
    // color?: string;
    [key: string]: any; // اگر نمی‌دونی props چیه، موقتاً any بذار
}

declare const Smook: FC<SmookProps>;

interface ImportMetaEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly BASE_URL: string;
    readonly VITE_APP_TITLE?: string; // هر متغیر دلخواه که با VITE_ شروع می‌شود
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}