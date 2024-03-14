import { Injectable } from '@angular/core';
import { HttpService } from '../http/http-client-wrapper.service';
import { Artifact } from '@lib/interfaces/artifact';
import { Observable, filter, from, map, take } from 'rxjs';
import { Article, BlocksEntity } from '@lib/interfaces/article';

@Injectable({
    providedIn: 'root',
})
export class ArtifactService {
    constructor(protected httpService: HttpService) {}

    public getArtifacts(): Observable<Artifact[]> {
        return this.httpService.get<Artifact[]>('/fetch');
    }

    public getArtifactsById(id: string): Observable<Article> {
        id = 'a3b9c8d7e6f5a4b3c2d1e0f';
        return this.httpService.get<Article>(`/artifacts?id=${id}`);
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
}
