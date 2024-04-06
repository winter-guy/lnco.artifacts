import { Tag } from '@lib/interfaces/article';
import { Document, InShort } from './record';

export interface Compose {
    header: string;
    description: string;
    draftId: string;
    tags: Tag[];
    article: Document;
    images: string[];
    inShort: InShort[];

    author: string;
}
