declare module '*.mp4' {
    const src: string;
    export default src;
}

declare module '*.webm' { // Add other video formats as needed
    const src: string;
    export default src;
}

declare module '*.png' { // Example for PNG images
    const src: string;
    export default src;
}

declare module '*.jpg' { // Example for JPG images
    const src: string;
    export default src;
}

declare module '*.jpeg' { // Example for JPEG images
    const src: string;
    export default src;
}

declare module '*.gif' { // Example for GIF images
    const src: string;
    export default src;
}

declare module '*.svg' { // Example for SVG images
    import * as React from "react";
    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;
    const src: string;
    export default src;
    // const content: string;
    // export default content;
}
declare module '*.pdf' { // Example for PDF images
    const content: string;
    export default content;
}
declare module "*.scss";
declare module "*.webp";

// Add more declarations for other asset types (images, fonts, etc.) as needed.