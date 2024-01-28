import { Article, Tag } from '@lib/interfaces/article';

export interface Compose {
    header: string;
    description: string;
    draftId: string;
    tags: Tag[];
    article: Article | unknown;
    images: string[];
}
