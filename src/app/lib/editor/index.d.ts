/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */

declare module '@editorjs/embed' {
    const DelimiterEmbed: ToolConstructable | ToolSettings<any>;
    export default DelimiterEmbed;
}

declare module '@editorjs/header' {
    const HeaderHeader: ToolConstructable | ToolSettings<any>;
    export default HeaderHeader;
}

declare module '@editorjs/list' {
    const List: ToolConstructable | ToolSettings<any>;
    export default List;
}

declare module '@editorjs/marker' {
    const Marker: ToolConstructable | ToolSettings<any>;
    export default Marker;
}

declare module '@editorjs/image' {
    const ImageTool: ToolConstructable | ToolSettings<any>;
    export default ImageTool;
}

declare module '@editorjs/raw' {
    const RawTool: ToolConstructable | ToolSettings<any>;
    export default RawTool;
}

declare module '@editorjs/delimiter' {
    const Delimiter: ToolConstructable | ToolSettings<any>;
    export default Delimiter;
}

interface embed {
    class: {
        patterns: {
            coub: RegExp;
            youtube: RegExp;
        };
        services: {
            coub: RegExp;
            youtube: RegExp;
        };
        config: {
            services: {
                coub: boolean;
                youtube: boolean;
            };
            inlineToolbar: boolean;
        };
    };
}

interface image {
    class: any;
    config: {
        uploader: {
            uploadByFile: any;
            uploadByUrl: any;
        };
    };
}
