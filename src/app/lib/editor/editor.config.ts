/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */

import Delimiter from '@editorjs/delimiter';
import DelimiterEmbed from '@editorjs/embed';
import HeaderHeader from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import RawTool from '@editorjs/raw';

import { UploadBlobToS3BucketAndGetUrl, UploadByUrlToS3BucketAndGetUrl } from '@lib/services/core/publish';

export const toolsConfig = {
    Marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
    },
    header: {
        class: HeaderHeader,
        inlineToolbar: ['link', 'bold', 'italic'],
    },
    list: {
        class: List,
        inlineToolbar: ['link', 'bold'],
    },
    embed: {
        class: DelimiterEmbed,
        inlineToolbar: false,
        config: {
            services: {
                youtube: true,
                coub: true,
            },
        },
    },
    image: {
        class: ImageTool,
        config: {
            uploader: {
                /**
                 * Upload file to the server and return an uploaded image data
                 * @param {File} file - file selected from the device or pasted by drag-n-drop
                 * @return {Promise.<{success, file: {url}}>}
                 */
                async uploadByFile(file: Blob) {
                    return new Promise((resolve, reject) => {
                        UploadBlobToS3BucketAndGetUrl(file).subscribe(
                            (res) => {
                                resolve(res);
                            },
                            (error) => {
                                reject(error);
                            },
                        );
                    });
                },
                async uploadByUrl(url: string) {
                    return new Promise((resolve, reject) => {
                        UploadByUrlToS3BucketAndGetUrl(url).subscribe(
                            (res) => {
                                resolve(res);
                            },
                            (error) => {
                                reject(error);
                            },
                        );
                    });
                },
            },
        },
    },
    raw: RawTool,
    delimiter: Delimiter,
};

export const editorjsConfig = {
    holder: 'editorjs',
    autofocus: false,
    readOnly: false,
    placeholder: 'Share your story ... ',
    tools: toolsConfig,
};

export const editorjsConfigReadOnly = {
    holder: 'editorjs',
    autofocus: false,
    readOnly: true,
    tools: toolsConfig,
    data: {},
};
