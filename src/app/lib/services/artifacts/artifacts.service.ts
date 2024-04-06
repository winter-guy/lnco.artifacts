import { Injectable } from '@angular/core';
import { HttpService } from '../http/http-client-wrapper.service';
import { Artifact } from '@lib/interfaces/artifact';
import { Observable, filter, from, map, take } from 'rxjs';
import { BlocksEntity, Tag } from '@lib/interfaces/article';
import { Document, InShort, Meta, Record, SecRecord } from '@lib/interfaces/record';
import { Compose } from '@lib/interfaces/compose';

@Injectable({
    providedIn: 'root',
})
export class ArtifactService {
    constructor(protected httpService: HttpService) {}

    public getArtifacts(): Observable<Artifact[]> {
        return this.httpService.get<Artifact[]>('/fetch');
    }

    public getArtifactsById(id: string): Observable<SecRecord> {
        return this.httpService.get<SecRecord>(`/fetch/${id}`);
    }

    public getImageFromPublication(blocks: BlocksEntity[]): Observable<string[]> {
        return new Observable((observer) => {
            if (!blocks) {
                observer.next([]);
                observer.complete();
                return;
            }

            const imageUrls = blocks
                .filter((element) => element.type === 'image' && element.data?.file?.url)
                .map((element) => element.data?.file?.url)
                .filter((url): url is string => url !== undefined);

            observer.next(imageUrls || []);
            observer.complete();
        });
    }

    public getContentFromPublication(blocks: BlocksEntity[]): Observable<string> {
        return from(blocks).pipe(
            filter((element) => element.type === 'paragraph'),
            map((element) => new DOMParser().parseFromString(element.data?.text || '', 'text/html').body.innerText),
            take(1),
        );
    }

    public postArtifact(record: Partial<Record>): Observable<Record> {
        console.log(record);
        return this.httpService.post<Record, Partial<Record>>(`/publish`, record);
    }

    public deleteArtifact(id: string): Observable<unknown> {
        return this.httpService.delete(`/remove/${id}`);
    }

    // eslint-disable-next-line prettier/prettier
    public async postPublicationMapper(composer: Compose, poster: string | undefined, record: Document, inShort: InShort[], tags: Tag[]): Promise<Partial<Record>> {
        return new Promise<Partial<Record>>((resolve, reject) => {
            try {
                const meta: Meta = {
                    id: composer.draftId,
                    author: '',
                    username: '',
                    poster: poster,
                    tags: tags,
                    imgs: composer.images,
                    createdDate: Number(new Date()),
                    modifiedDate: Number(new Date()),
                    head: composer.header,
                    meta: '',
                    details: composer.description,
                    cl: 0,
                };

                resolve({
                    record: record,
                    meta: meta,
                    inShort: inShort,
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
