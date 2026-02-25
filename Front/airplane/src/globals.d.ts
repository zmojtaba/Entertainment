// global.d.ts یا بالای پروژه
declare global {
  interface Window {
    wait: (ms?: number) => Promise<void>;
  }
}


declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {
  const src: string;
  export default src;
}

export { }; // برای module شدن فایل
