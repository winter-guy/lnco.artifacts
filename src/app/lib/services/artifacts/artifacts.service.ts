import { Injectable } from '@angular/core';
import { HttpService } from '../http/http-client-wrapper.service';
import { Artifact } from '@lib/interfaces/artifact';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ArtifactService {
    constructor(protected httpService: HttpService) {}

    public getArtifacts(): Observable<Artifact[]> {
        return this.httpService.get<Artifact[]>('/articles');
    }

    public getArtifactsById(id: string): Observable<Artifact[]> {
        id = 'a3b9c8d7e6f5a4b3c2d1e0f';
        return this.httpService.get<Artifact[]>(`/artifacts?id=${id}`);
    }
}
