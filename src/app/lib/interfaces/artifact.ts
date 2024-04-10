import { Tag } from './article';

export interface Artifact {
    id: string;
    createdDate: string;
    img: string;
    background: string;
    head: string;
    meta: string;
    details: string;

    tags: Tag[];
    author: string;
    forepart: string;
    backdrop: string;
    modifiedDate: number;
    cl: number;
}
